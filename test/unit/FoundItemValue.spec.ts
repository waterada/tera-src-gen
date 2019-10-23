import { FoundItemValue } from '../../src';

describe('FoundItemValue', () => {
    describe('snake2camel', () => {
        it.each([
            // str, expected
            ['aaa_bbb_ccc', 'AaaBbbCcc'],
            ['__aaa_bbb', 'AaaBbb'],
        ])('%s', (str, expected) => {
            expect(FoundItemValue.snake2camel(str)).toBe(expected);
        });
    });

    describe('camel2snake', () => {
        it.each([
            // str, expected
            ['AaaBbbCcc', 'aaa_bbb_ccc'],
            ['aaaBbbCcc', 'aaa_bbb_ccc'],
        ])('%s', (str, expected) => {
            expect(FoundItemValue.camel2snake(str)).toBe(expected);
        });
    });

    it('test', () => {
    // const aaa = FoundItemValue.create('abc');
    // expect(aaa.value).toBe('abc');
    // expect(aaa.substring(1, 2)).toBe('b');
    });
});
