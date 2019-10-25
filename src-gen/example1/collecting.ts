import TeraSrcGen, { CollectorPrefix } from 'tera-src-gen';

export default new TeraSrcGen().collectItems({
    targetGlobs: [`/targets/**/*.py`],
    collector: new CollectorPrefix('# @TEST'),
}).allowKeys({
    'api': true,
});
