import gen from './01-collecting';

gen.insertIntoFile(
    `${__dirname}/output/22-target.js`,
    {
        from: '// ↓自動\n',
        to: '// ↑自動\n',
    },
    ({ items }) => items.outputGroupedByKey('tableName', (tableName, items) => {
        const fields = items.list.filter(
            item =>
                !item.get('autoIncrement').value &&
                item.get('name').value !== 'constraint',
        );
        return `\
    ${tableName}: __fabricate('${tableName}', async record => {
        await db.query(
            \`INSERT INTO logs (${fields.map(item => item.get('name').value).join(', ')})
             VALUES (${fields.map(() => '?').join(', ')})\`,
            [
` + fields.map(item => {
            if (item.get('autoIncrement').value) return '';
            if (item.get('name').value === 'constraint') return '';
            const t = item.get('type').value;
            let defVal = "'A'";
            if (t === 'int') defVal = '1';
            if (t === 'bigint') defVal = '9999';
            return `\
                __orDefVal(record['${item.get('name')}'], ${defVal}),
`;
        }).join('') + `\
            ]
        );
    }),
`;
    })
);
