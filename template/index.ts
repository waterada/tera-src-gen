import TeraSrcGen, { CollectorPrefix } from '../src';
const gen = new TeraSrcGen();
gen.collectItems({
    targetDirList: ['/app/path/to/src/dir'],
    targetFileRegExp: /^.*\.py$/,
    collector: new CollectorPrefix('# @TEST'),
});
import template = require('./example.yaml');
template(gen);
