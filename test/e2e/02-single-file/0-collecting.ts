import TeraSrcGen, { CollectorPrefix } from '../../../src';

export default new TeraSrcGen().collectItems({
    targetGlobs: [`${__dirname}/2-target.yaml`],
    collector: new CollectorPrefix('  # @TEST'),
});
