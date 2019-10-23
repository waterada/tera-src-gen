import E2eCase from '../e2e-case';

describe('03-fabricate', () => {
    it('実際に出力', () => {
        const case1 = new E2eCase(
            __dirname,
            { TARGET: '22-target.js', EXPECTED: '30-expected.js' },
            true,
        );
        case1.initializeFiles();
        require('./80-fabricate');
        case1.assertOutput();
    });
});
