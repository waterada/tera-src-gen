import TeraSrcGen, { CollectorPrefix } from '../../../src';

const gen = new TeraSrcGen();
gen.collectItems({
    targetGlobs: [`${__dirname}/2-target.yaml`],
    collector: new CollectorPrefix('  # @TEST'),
});
import template = require('./1-template');
template(gen);
