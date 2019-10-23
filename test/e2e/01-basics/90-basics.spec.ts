import E2eCase from '../e2e-case';

describe('01-basics', () => {
    it('実際に出力', () => {
        const case1 = new E2eCase(__dirname, {
            TARGET: '12-target.yaml',
            EXPECTED: '13-expected.yaml',
        });
        const case2 = new E2eCase(
            __dirname,
            { TARGET: '22-target.yaml', EXPECTED: '23-expected.yaml' },
            true,
        );
        case1.initializeFiles();
        case2.initializeFiles();
        require('./80-basics');
        case1.assertOutput();
        case2.assertOutput();
    });
});
