import { FoundItem } from '../../src';

describe('FoundItem', () => {
    describe('Basic property', () => {
        it('File is snake', () => {
            const item = new FoundItem('aaa_bbb_ccc.js');
            expect(item.fileName).toBe('aaa_bbb_ccc.js');
            expect(item.fileBase).toBe('aaa_bbb_ccc');
            expect(item.fileBaseSnake).toBe('aaa_bbb_ccc');
            expect(item.fileBaseCamel).toBe('AaaBbbCcc');
        });
        it('File is camel', () => {
            const item = new FoundItem('AaaBbbCcc.js');
            expect(item.fileName).toBe('AaaBbbCcc.js');
            expect(item.fileBase).toBe('AaaBbbCcc');
            expect(item.fileBaseSnake).toBe('aaa_bbb_ccc');
            expect(item.fileBaseCamel).toBe('AaaBbbCcc');
        });
    });

    describe('get/has/orDefault', () => {
        it.each([
            // title, data, key, expected
            [
                '通常',
                { xx: 'aaa' },
                'xx',
                { get: 'aaa', has: true, orDefault: 'aaa' },
            ],
            [
                '1単語目',
                { xx: 'aa bb  cc' },
                'xx[0]',
                { get: 'aa', has: true, orDefault: 'aa' },
            ],
            [
                '2単語目',
                { xx: 'aa bb  cc' },
                'xx[1]',
                { get: 'bb', has: true, orDefault: 'bb' },
            ],
            [
                '3単語目',
                { xx: 'aa bb  cc' },
                'xx[2]',
                { get: 'cc', has: true, orDefault: 'cc' },
            ],
            [
                '4単語目(なし)',
                { xx: 'aa bb  cc' },
                'xx[3]',
                { get: '', has: false, orDefault: 'None' },
            ],
            [
                '空欄が値',
                { xx: '' },
                'xx',
                { get: '', has: true, orDefault: '' },
            ],
            [
                'キーなし',
                {},
                'xx',
                { get: '', has: false, orDefault: 'None' },
            ],
        ])(
            '%s',
            (
                title,
                data: { [k: string]: string },
                key: string,
                expected: {
                    get: string;
                    has: boolean;
                    orDefault: string;
                },
            ) => {
                const item = new FoundItem('a.xx', { [key]: true });
                item._data = data;
                expect(item.get(key).toString()).toBe(expected.get);
                expect(item.has(key)).toBe(expected.has);
                expect(item.get(key).orDefault('None').toString()).toBe(expected.orDefault);
            },
        );

        it('ファイル名を get でも取れる', () => {
            const item = new FoundItem('aa_bb.xx', {
                'fileName': true,
                'fileBase': true,
                'fileBaseSnake': true,
                'fileBaseCamel': true,
            });
            expect(item.get('fileName').toString()).toBe('aa_bb.xx');
            expect(item.get('fileBase').toString()).toBe('aa_bb');
            expect(item.get('fileBaseSnake').toString()).toBe('aa_bb');
            expect(item.get('fileBaseCamel').toString()).toBe('AaBb');
        });

        it('allowKeys', () => {
            const item = new FoundItem('', {
                'aaa': true,
                'aaa[1]': true,
                'bbb': item => item.get('aaa[1]'), // エイリアスを設定できる
            });
            item.set('aaa', 'x y');
            expect(item.get('aaa').value).toBe('x y');
            expect(item.get('aaa[1]').value).toBe('y');
            expect(item.get('bbb').value).toBe('y');
        });
    });
});
