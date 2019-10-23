import TeraSrcGen, { CollectorPrefix } from '../../../src';

const gen = new TeraSrcGen();
gen.collectItems({
    targetDirList: [`${__dirname}/src`],
    targetFileRegExp: /^.*\.py$/,
    collector: new CollectorPrefix('# @TEST'),
});
import template1 = require('./11-template');
import template2 = require('./21-template');
template1(gen);
template2(gen);
