import Collector from './Collector';

function ezRegExp (
    str: string,
    pattern: string,
    cb: (...hits: string[]) => void,
): boolean {
    const regExp = new RegExp(
        pattern
            .replace(/\[( +)]/g, (__, spc) => spc.replace(/ /g, '\\s'))
            .replace(/ {2}/g, '\\s+')
            .replace(/ /g, '\\s*')
            .replace(/\(WORD\)/g, '(\\w+)')
            .replace(/\(NUM\)/g, '(\\d+)')
            .replace(/{/g, '(?:')
            .replace(/}/g, ')?'),
    );
    const matches = str.match(regExp);
    if (matches) {
        matches.shift();
        cb(...matches);
        return true;
    } else {
        return false;
    }
}

class Logic {
    constructor (
        private _appender: (oneFound: { [key: string]: string }) => void,
        private _curTable: string = '',
        public state: Function = Logic.prototype.WAIT_CREATE_TABLE,
    ) {
    }

    WAIT_CREATE_TABLE (line: string): void {
        ezRegExp(line, '^create  table  (WORD)\\b', tableName => {
            this._curTable = tableName;
            this.state = this.WAIT_COLUMN;
        });
    }

    WAIT_COLUMN (line: string): void {
        ezRegExp(
            line,
            `^[    ](WORD)  (WORD) {\\((NUM)\\)}{  (unsigned)}{  (auto_increment)}{  (not[ ]null)}{  comment  '([^']+)'} {,}`,
            (name, type, size, unsigned, autoIncrement, notNull, comment) => {
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
            },
        ) ||
        ezRegExp(line, `^\\)`, () => {
            this.state = this.WAIT_CREATE_TABLE;
        });
    }
}

export default class CollectorCreateTableMysql extends Collector {
    extract (
        text: string,
        appender: (oneFound: { [key: string]: string }) => void,
    ): void {
        const logic = new Logic(appender);
        for (const line of text.split(/\n/)) {
            logic.state(line);
        }
    }
}
