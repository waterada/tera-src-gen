const db = require('../db');

const __orDefVal = (value, defVal) => value === undefined ? defVal : value;
const __fabricate = async (tableName, fabricateRecords) => {
    return async records => {
        await db.query(`TRUNCATE TABLE ${tableName}`);
        for (const record of records) {
            await fabricateRecords(record);
        }
    };
};

const fabricate = {
// ↓自動
    logs: __fabricate('logs', async record => {
        await db.query(
            `INSERT INTO logs (user_id, category, big_num)
             VALUES (?, ?, ?)`,
            [
                __orDefVal(record['user_id'], 1),
                __orDefVal(record['category'], 'A'),
                __orDefVal(record['big_num'], 9999),
            ]
        );
    }),
// ↑自動
};

export default fabricate;
