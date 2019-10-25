"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FoundItemValue {
    constructor(value, _exists = true) {
        this.value = value;
        this._exists = _exists;
    }
    orDefault(v) {
        if (this._exists) {
            return this;
        }
        else {
            return new FoundItemValue(v);
        }
    }
    exists() {
        return this._exists;
    }
    at(i) {
        if (this._exists) {
            const split = this.value.split(/\s+/);
            if (i in split) {
                return new FoundItemValue(split[i]);
            }
        }
        return FoundItemValue.createBlank();
    }
    json(key) {
        return JSON.parse(this.value)[key];
    }
    output(cb) {
        return this._exists ? cb(this.value, this) : '';
    }
    toString() {
        return this.value;
    }
    [Symbol.toPrimitive]() {
        return this.value;
    }
    static createBlank() {
        return new FoundItemValue('', false);
    }
    static snake2camel(str) {
        str = str.replace(/(?:^|_)([a-z0-9])/g, (__, s) => s.toUpperCase());
        return str.replace(/_/g, '');
    }
    static camel2snake(str) {
        str = str.replace(/(.)([A-Z][a-z]+)/g, '$1_$2');
        return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
    }
}
exports.default = FoundItemValue;
