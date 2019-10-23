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
// ↑自動
};

export default fabricate;
