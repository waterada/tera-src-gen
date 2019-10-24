import TeraSrcGen, { CollectorCreateTableMysql } from '../../../src';

export default new TeraSrcGen().collectItems({
    targetGlobs: [`${__dirname}/21-init.sql`],
    collector: new CollectorCreateTableMysql(),
}).allowKeys({
    tableName: true,
    name: true,
    type: true,
    size: true,
    unsigned: true,
    autoIncrement: true,
    notNull: true,
    comment: true,
});
