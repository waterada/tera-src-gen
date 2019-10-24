import E2eCase from '../e2e-case';

describe('01-basics', () => {
    it('実際に出力', () => {
        const case1 = new E2eCase(__dirname, { TARGET: '21-target.yaml', EXPECTED: '31-expected.yaml' });
        const case2 = new E2eCase(__dirname, { TARGET: '22-target.yaml', EXPECTED: '32-expected.yaml' }, true);
        case1.initializeFiles();
        case2.initializeFiles();
        require('./11-template');
        require('./12-template');
        case1.assertOutput();
        case2.assertOutput();
    });
});
