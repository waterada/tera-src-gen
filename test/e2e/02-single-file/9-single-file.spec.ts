import E2eCase from '../e2e-case';

describe('02-single-file', () => {
    it('実際に出力', () => {
        const case1 = new E2eCase(__dirname, { TARGET: '2-target.yaml', EXPECTED: '3-expected.yaml' }, true);
        case1.initializeFiles();
        require('./1-template');
        case1.assertOutput();
    });
});
