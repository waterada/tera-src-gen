"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FoundItemValue_1 = require("./FoundItemValue");
/**
 * コメント注釈１ファイル分のデータ
 */
class FoundItem {
    constructor(fileName, __allowKeys = {}, _data = {}) {
        this.fileName = fileName;
        this.__allowKeys = __allowKeys;
        this._data = _data;
        this.fileName = fileName;
    }
    allowKeys(allowKeys) {
        return new FoundItem(this.fileName, allowKeys, this._data);
    }
    get fileBase() {
        return this.fileName.replace(/\.\w+$/, '');
    }
    get fileBaseSnake() {
        return FoundItemValue_1.default.camel2snake(this.fileBase);
    }
    get fileBaseCamel() {
        return FoundItemValue_1.default.snake2camel(this.fileBaseSnake);
    }
    get(_key) {
        // キーが許されているか
        if (_key in this.__allowKeys) {
            const allowed = this.__allowKeys[_key];
            if (allowed === true) {
                // 何もしない（補完のためのみ）
            }
            else {
                const val = allowed(this);
                if (val instanceof FoundItemValue_1.default) {
                    return val;
                }
                else {
                    return new FoundItemValue_1.default(val);
                }
            }
        }
        else {
            throw new Error(`The key "${_key}" is not allowed. Please define using gen.allowKeys({ "${_key}": true })`);
        }
        // キーが配列形式で指定されていたら分解
        const key = _key;
        if (key.slice(-1) === ']') {
            const matches = key.match(/^(.+)\[(\d+)]$/);
            if (matches) {
                const k = matches[1];
                const i = parseInt(matches[2]);
                if (k in this._data) {
                    const split = this._data[k].split(/\s+/);
                    if (i in split)
                        return new FoundItemValue_1.default(split[i]);
                }
            }
        }
        // 予約語対応
        if (key === 'fileName')
            return new FoundItemValue_1.default(this.fileName);
        if (key === 'fileBase')
            return new FoundItemValue_1.default(this.fileBase);
        if (key === 'fileBaseCamel')
            return new FoundItemValue_1.default(this.fileBaseCamel);
        if (key === 'fileBaseSnake')
            return new FoundItemValue_1.default(this.fileBaseSnake);
        // 通常データ
        if (key in this._data) {
            return new FoundItemValue_1.default(this._data[key]);
        }
        // それ以外はブランクを返す
        return FoundItemValue_1.default.createBlank();
    }
    has(key) {
        return this.get(key).exists();
    }
    set(key, val) {
        this._data[key] = val;
        return this;
    }
    setAll(map) {
        for (const key of Object.keys(map)) {
            this._data[key] = map[key];
        }
        return this;
    }
    entries() {
        return Object.keys(this._data)
            .sort()
            .map(key => ({ key, v: new FoundItemValue_1.default(this._data[key]) }));
    }
}
exports.default = FoundItem;
