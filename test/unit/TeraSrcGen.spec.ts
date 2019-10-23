import TeraSrcGen, { FoundItem, AllowKeys, CollectorPrefix } from '../../src';

const __makeItem = <T extends AllowKeys>(
    fileName: string,
    cb: (item: FoundItem<T>) => void,
): FoundItem<T> => {
    const item = new FoundItem<T>(fileName);
    cb(item);
    return item;
};

describe('TeraSrcGen', () => {
    let extractor: TeraSrcGen<AllowKeys>;
    let __fs: jest.Mock;
    beforeEach(() => {
        extractor = new TeraSrcGen();
        extractor.__fs = __fs = jest.fn();
    });

    it('_readDir', () => {
        __fs.mockReturnValueOnce({ readdirSync: () => ['f11', 'f12'] });
        __fs.mockReturnValueOnce({ readdirSync: () => ['f21', 'f22'] });
        expect(extractor._readDir(['d1', 'd2'])).toEqual([
            'd1/f11',
            'd1/f12',
            'd2/f21',
            'd2/f22',
        ]);
    });

    describe('_filterFiles', () => {
        it('非ファイルと正規表現にマッチしなかったファイルが除外される', () => {
            __fs.mockReturnValueOnce({ statSync: () => ({ isFile: () => true }) });
            __fs.mockReturnValueOnce({ statSync: () => ({ isFile: () => true }) });
            __fs.mockReturnValueOnce({ statSync: () => ({ isFile: () => false }) });
            __fs.mockReturnValueOnce({ statSync: () => ({ isFile: () => true }) });
            expect(
                extractor._filterFiles(
                    ['d/f1.js', 'd/f2.py', 'd/d', 'd/f3.js'],
                    /\.js/,
                ),
            ).toEqual(['d/f1.js', 'd/f3.js']);
        });
        it('ファイル名固定でマッチされる', () => {
            __fs.mockReturnValue({ statSync: () => ({ isFile: () => true }) });
            expect(extractor._filterFiles(['d/f1.js', 'd/f2.py'], /^f1\.js/)).toEqual(
                ['d/f1.js'],
            );
        });
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
            targetDirList: ['d'],
            targetFileRegExp: /\.js$/,
            collector: new CollectorPrefix('# @TEST'),
        };
        it('注釈あり', () => {
            const ITEM1 = __makeItem('f1', item => item.set('x', 1));
            extractor._readDir = jest.fn().mockReturnValue(['f1', 'f2', 'f3', 'f4']);
            extractor._filterFiles = jest.fn().mockReturnValue(['f1', 'f2', 'f3']);
            extractor._collectItems = jest
                .fn()
                .mockReturnValue({ items: [ITEM1], fileItems: [ITEM1] });
            extractor.collectItems(opt);
            expect(extractor).toMatchObject(new TeraSrcGen([ITEM1], [ITEM1]));
            expect(extractor._readDir).toBeCalledWith(opt.targetDirList);
            expect(extractor._filterFiles).toBeCalledWith(
                ['f1', 'f2', 'f3', 'f4'],
                opt.targetFileRegExp,
            );
            expect(extractor._collectItems).toBeCalledWith(
                ['f1', 'f2', 'f3'],
                opt.collector,
            );
        });
        it('注釈なし', () => {
            extractor._readDir = jest.fn().mockReturnValue([]);
            extractor._filterFiles = jest.fn().mockReturnValue([]);
            extractor._collectItems = jest
                .fn()
                .mockReturnValue({ items: [], fileItems: [] });
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
            bbb: item => item.get('aaa[1]'), // エイリアスを設定できる
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
