import TeraSrcGen, { FoundItem, AllowKeys, CollectorPrefix } from '../../src';

const __makeItem = (
    fileName: string,
    cb: (item: FoundItem<AllowKeys>) => void,
): FoundItem<AllowKeys> => {
    const item = new FoundItem(fileName, { 'aaa': true });
    cb(item);
    return item;
};

describe('TeraSrcGen', () => {
    let extractor: TeraSrcGen<AllowKeys>;
    let __fs: jest.Mock;
    let __globSync: jest.Mock;
    beforeEach(() => {
        extractor = new TeraSrcGen().allowKeys({ 'aaa': true });
        extractor.__fs = __fs = jest.fn();
        extractor.__globSync = __globSync = jest.fn();
    });

    it('_globFiles', () => {
        __globSync.mockReturnValueOnce(['d1/f11', 'd1/f12']);
        __globSync.mockReturnValueOnce(['d2/f21', 'd2/f22']);
        expect(extractor._globFiles(['d1', 'd2'])).toEqual([
            'd1/f11',
            'd1/f12',
            'd2/f21',
            'd2/f22',
        ]);
    });

    describe('_collectItems', () => {
        it('注釈取れる', () => {
            __fs.mockReturnValueOnce({
                readFileSync: () => `\
import 'aaa';

# @TEST xx: aa
# @TEST yy: bb
const a = b;
`,
            });
            __fs.mockReturnValueOnce({
                readFileSync: () => `\
import 'aaa';

# 注釈は存在しない
const a = b;
`,
            });
            expect(
                extractor._collectItems(
                    ['d/f1.js', 'd/f2.js'],
                    new CollectorPrefix('# @TEST'),
                ),
            ).toEqual({
                items: [
                    __makeItem('f1.js', item => item.set('xx', 'aa')),
                    __makeItem('f1.js', item => item.set('yy', 'bb')),
                ],
                fileItems: [
                    __makeItem('f1.js', item => item.set('xx', 'aa').set('yy', 'bb')),
                ],
            });
        });
    });

    describe('collectItems', () => {
        const opt = {
            targetGlobs: ['d/*.js'],
            collector: new CollectorPrefix('# @TEST'),
        };
        it('注釈あり', () => {
            const ITEM1 = __makeItem('f1', item => item.set('x', 1));
            extractor._globFiles = jest.fn().mockReturnValue(['d/f1', 'd/f2', 'd/f3', 'd/f4']);
            extractor._collectItems = jest.fn().mockReturnValue({ items: [ITEM1], fileItems: [ITEM1] });
            const actual = extractor.collectItems(opt);
            expect(actual).toMatchObject(new TeraSrcGen([ITEM1], [ITEM1]));
            expect(extractor._globFiles).toBeCalledWith(opt.targetGlobs);
            expect(extractor._collectItems).toBeCalledWith(
                ['d/f1', 'd/f2', 'd/f3', 'd/f4'],
                opt.collector,
            );
        });
        it('注釈なし', () => {
            extractor._globFiles = jest.fn().mockReturnValue([]);
            extractor._collectItems = jest.fn().mockReturnValue({ items: [], fileItems: [] });
            expect(() => extractor.collectItems(opt)).toThrow(
                'コメント注釈が見つかりませんでした。',
            );
        });
    });

    describe('allowKeys', () => {
        const extractor = new TeraSrcGen<AllowKeys>(
            [__makeItem('1.tmp', item => item.set('aaa', 'x y'))],
            [__makeItem('1.tmp', item => item.set('aaa', 'x y'))],
        );
        const allowKeys = {
            aaa: true,
            bbb: item => item.get('aaa').at(1), // エイリアスを設定できる
        } as AllowKeys;
        const extractor2 = extractor.allowKeys(allowKeys);
        // expect(extractor2).toEqual(new CommentAnnotationExtractor([
        //     __makeItem('1.tmp', item => item.set('aaa', 'x y').allowKeys(allowKeys)),
        // ], allowKeys));
        const writeFileSync = jest.fn();
        extractor2.__fs = __fs = jest.fn(() => ({ writeFileSync })) as jest.Mock;
        extractor2.__resolvePath = jest.fn(v => v);
        extractor2.outputFile('aaa.out', ({ items }) => {
            return items.outputEach(item => `aaa: '${item.get('bbb')}'\n`);
        });
        expect(writeFileSync).toBeCalledWith('aaa.out', "aaa: 'y'\n", {
            encoding: 'utf8',
        });
    });
});
