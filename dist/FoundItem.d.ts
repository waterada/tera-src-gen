import FoundItemValue from './FoundItemValue';
import { AllowKeys } from './types';
/**
 * コメント注釈１ファイル分のデータ
 */
export default class FoundItem<T extends AllowKeys> {
    fileName: string;
    __allowKeys: T;
    _data: {
        [key: string]: string;
    };
    constructor(fileName: string, __allowKeys?: T, _data?: {
        [key: string]: string;
    });
    allowKeys<T2 extends T>(allowKeys: T2): FoundItem<T2>;
    readonly fileBase: string;
    readonly fileBaseSnake: string;
    readonly fileBaseCamel: string;
    get(_key: keyof T | string): FoundItemValue;
    has(key: keyof T | string): boolean;
    set(key: keyof T | string, val: string): FoundItem<T>;
    setAll(map: {
        [key: string]: string;
    }): FoundItem<T>;
    entries(): {
        key: string;
        v: FoundItemValue;
    }[];
}
