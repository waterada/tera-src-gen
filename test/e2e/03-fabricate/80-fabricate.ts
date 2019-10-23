import TeraSrcGen, { CollectorCreateTableMysql } from '../../../src';

const gen = new TeraSrcGen();
gen.collectItems({
    targetDirList: [__dirname],
    targetFileRegExp: /^21-init\.sql$/,
    collector: new CollectorCreateTableMysql(),
});
import template = require('./10-template');
template(gen);
