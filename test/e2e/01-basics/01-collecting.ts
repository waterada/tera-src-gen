import TeraSrcGen, { CollectorPrefix } from '../../../src';

export default new TeraSrcGen().collectItems({
    targetGlobs: [`${__dirname}/src/*.py`],
    collector: new CollectorPrefix('# @TEST'),
}).allowKeys({
    'api': true,
    'api[0]': true,
    'api[1]': true,
    'special': true,
    'special-0': item => item.get('special').at(0),
});
