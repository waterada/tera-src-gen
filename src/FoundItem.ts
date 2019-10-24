import FoundItemValue from './FoundItemValue';
import { AllowKeys } from './types';

/**
 * コメント注釈１ファイル分のデータ
 */
export default class FoundItem<T extends AllowKeys> {
    constructor (
        public fileName: string,
        public __allowKeys: T = {} as T,
        public _data: { [key: string]: string } = {},
    ) {
        this.fileName = fileName;
    }

    allowKeys<T2 extends T> (allowKeys: T2): FoundItem<T2> {
        return new FoundItem(this.fileName, allowKeys, this._data);
    }

    get fileBase (): string {
        return this.fileName.replace(/\.\w+$/, '');
    }

    get fileBaseSnake (): string {
        return FoundItemValue.camel2snake(this.fileBase);
    }

    get fileBaseCamel (): void | string {
        return FoundItemValue.snake2camel(this.fileBaseSnake);
    }

    get (_key: keyof T | string): FoundItemValue {
        // キーが許されているか
        if (_key in this.__allowKeys) {
            const allowed = this.__allowKeys[_key];
            if (allowed === true) {
                // 何もしない（補完のためのみ）
            } else {
                const val = (allowed as Function)(this);
                if (val instanceof FoundItemValue) {
                    return val;
                } else {
                    return new FoundItemValue(val);
                }
            }
        } else {
            throw new Error(`The key "${_key}" is not allowed. Please define using gen.allowKeys({ "${_key}": true })`);
        }
        // キーが配列形式で指定されていたら分解
        const key = _key as string;
        if (key.slice(-1) === ']') {
            const matches = key.match(/^(.+)\[(\d+)]$/);
            if (matches) {
                const k = matches[1];
                const i = matches[2];
                if (k in this._data) {
                    const split = this._data[k].split(/\s+/);
                    if (i in split) return new FoundItemValue(split[i]);
                }
            }
        }
        // 予約語対応
        if (
            ['fileName', 'fileBase', 'fileBaseCamel', 'fileBaseSnake'].includes(key)
        ) {
            return new FoundItemValue(this[key]);
        }
        // 通常データ
        if (key in this._data) {
            return new FoundItemValue(this._data[key]);
        }
        // それ以外はブランクを返す
        return FoundItemValue.createBlank();
    }

    has (key: keyof T | string): boolean {
        return this.get(key).exists();
    }

    set (key: keyof T | string, val): FoundItem<T> {
        this._data[key as string] = val;
        return this;
    }

    setAll (map: { [key: string]: string }): FoundItem<T> {
        for (const key of Object.keys(map)) {
            this._data[key] = map[key];
        }
        return this;
    }

    entries (): { key: string; v: FoundItemValue }[] {
        return Object.keys(this._data)
            .sort()
            .map(key => ({ key, v: new FoundItemValue(this._data[key]) }));
    }
}
