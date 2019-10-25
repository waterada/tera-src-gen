"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collector_1 = require("./Collector");
function ezRegExp(str, pattern, cb) {
    const regExp = new RegExp(pattern
        .replace(/\[( +)]/g, (__, spc) => spc.replace(/ /g, '\\s'))
        .replace(/ {2}/g, '\\s+')
        .replace(/ /g, '\\s*')
        .replace(/\(WORD\)/g, '(\\w+)')
        .replace(/\(NUM\)/g, '(\\d+)')
        .replace(/{/g, '(?:')
        .replace(/}/g, ')?'));
    const matches = str.match(regExp);
    if (matches) {
        matches.shift();
        cb(...matches);
        return true;
    }
    else {
        return false;
    }
}
class Logic {
    constructor(_appender, _curTable = '', state = Logic.prototype.WAIT_CREATE_TABLE) {
        this._appender = _appender;
        this._curTable = _curTable;
        this.state = state;
    }
    WAIT_CREATE_TABLE(line) {
        ezRegExp(line, '^create  table  (WORD)\\b', tableName => {
            this._curTable = tableName;
            this.state = this.WAIT_COLUMN;
        });
    }
    WAIT_COLUMN(line) {
        ezRegExp(line, `^[    ](WORD)  (WORD) {\\((NUM)\\)}{  (unsigned)}{  (auto_increment)}{  (not[ ]null)}{  comment  '([^']+)'} {,}`, (name, type, size, unsigned, autoIncrement, notNull, comment) => {
            this._appender({
                tableName: this._curTable,
                name,
                type,
                size,
                unsigned,
                autoIncrement,
                notNull,
                comment,
            });
        }) ||
            ezRegExp(line, `^\\)`, () => {
                this.state = this.WAIT_CREATE_TABLE;
            });
    }
}
class CollectorCreateTableMysql extends Collector_1.default {
    extract(text, appender) {
        const logic = new Logic(appender);
        for (const line of text.split(/\n/)) {
            logic.state(line);
        }
    }
}
exports.default = CollectorCreateTableMysql;
