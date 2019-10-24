import TeraSrcGen, { CollectorCreateTableMysql } from '../../../src';

const gen = new TeraSrcGen();
gen.collectItems({
    targetGlobs: [`${__dirname}/21-init.sql`],
    collector: new CollectorCreateTableMysql(),
});
import template = require('./10-template');
template(gen);
