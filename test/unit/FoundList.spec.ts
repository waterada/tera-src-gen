import { FoundList, FoundItem, AllowKeys } from '../../src';

const __makeItem = (
    fileName: string,
    cb: (item: FoundItem<AllowKeys>) => void,
) => {
    const item = new FoundItem(fileName, { 'fileName': true, 'val': true, 'val1': true, 'val2': true });
    cb(item);
    return item;
};

describe('FoundList', () => {
    it('filter', () => {
        const list = new FoundList([new FoundItem('1'), new FoundItem('2')]);
        expect(list.filter(item => item.fileName === '2')).toEqual(
            new FoundList([new FoundItem('2')]),
        );
    });

    describe('sortByLogic', () => {
        it('ソートされる', () => {
            const list = new FoundList([
                new FoundItem('bb'),
                new FoundItem('ba'),
                new FoundItem('a'),
            ]);
            expect(list.sortByLogic(item => item.fileName)).toEqual(
                new FoundList([
                    new FoundItem('a'),
                    new FoundItem('ba'),
                    new FoundItem('bb'),
                ]),
            );
        });
    });

    describe('sortByKey', () => {
        const __makeItems = () => {
            const ITEM1 = __makeItem('bbb', item => item.set('val', '1'));
            const ITEM2 = __makeItem('ba', item => item.set('val', '2'));
            const ITEM3 = __makeItem('aaaa', () => {});
            return [ITEM1, ITEM2, ITEM3];
        };
        it('ソートされる', () => {
            const [ITEM1, ITEM2, ITEM3] = __makeItems();
            const list = new FoundList([ITEM1, ITEM2, ITEM3]);
            expect(list.sortByKey('fileName')).toEqual(
                new FoundList([ITEM3, ITEM2, ITEM1]),
            );
        });
        it('キーが無いなら結果から間引かれる', () => {
            const [ITEM1, ITEM2, ITEM3] = __makeItems();
            const list = new FoundList([ITEM1, ITEM2, ITEM3]);
            expect(list.sortByKey('val')).toEqual(new FoundList([ITEM1, ITEM2]));
        });
        it('取得した値を書き換えてソートの基準にできる', () => {
            const [ITEM1, ITEM2, ITEM3] = __makeItems();
            const list = new FoundList([ITEM1, ITEM2, ITEM3]);
            expect(list.sortByKey('fileName', v => `${v.length}`)).toEqual(
                new FoundList([ITEM2, ITEM1, ITEM3]),
            );
        });
    });

    describe('sortByOrders', () => {
        const __makeItems = () => {
            const ITEM1 = __makeItem('1', () => {});
            const ITEM2 = __makeItem('2', () => {});
            const ITEM3 = __makeItem('3', () => {});
            return [ITEM1, ITEM2, ITEM3];
        };
        it('指定の順序でソートされる', () => {
            const [ITEM1, ITEM2, ITEM3] = __makeItems();
            const list = new FoundList([ITEM1, ITEM2, ITEM3]);
            expect(list.sortByOrders('fileName', ['2', '3', '1'])).toEqual(
                new FoundList([ITEM2, ITEM3, ITEM1]),
            );
        });
    });

    describe('outputGroupedByKey', () => {
        const __makeItems = () => {
            const ITEM11 = __makeItem('101', item =>
                item.set('val1', '1').set('val2', '1'),
            );
            const ITEM21 = __makeItem('201', item =>
                item.set('val1', '2').set('val2', '1'),
            );
            const ITEM12 = __makeItem('102', item => item.set('val1', '1'));
            const ITEM22 = __makeItem('202', item =>
                item.set('val1', '2').set('val2', '2'),
            );
            return [ITEM11, ITEM12, ITEM21, ITEM22];
        };
        it('指定したキーでグルーピングされる', () => {
            const list = new FoundList(__makeItems());
            expect(
                list.outputGroupedByKey('val1', (val, list) => {
                    return `${val}: ${list.outputEach(item => `${item.fileName},`)}\n`;
                }),
            ).toEqual('1: 101,102,\n2: 201,202,\n');
        });
    });
});
