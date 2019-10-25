import FoundItem from './FoundItem';
import FoundItemValue from './FoundItemValue';
import { AllowKeys } from './types';
/**
 * コメント注釈全ファイル文のデータ
 */
export default class FoundList<T extends AllowKeys> {
    list: FoundItem<T>[];
    constructor(list?: FoundItem<T>[]);
    push(v: FoundItem<T>): void;
    filter(cb: (item: FoundItem<T>) => boolean): FoundList<T>;
    /**
     * @param {function} [logic]
     */
    sortByLogic(logic: (item: FoundItem<T>) => string | number): FoundList<T>;
    /**
     * @param key
     * @param rewriteVal - 指定した場合は取得した値を書き換えてソートの基準にする
     */
    sortByKey(key: string, rewriteVal?: (v: string) => string | number): FoundList<T>;
    sortByOrders(key: string, orders: string[]): FoundList<T>;
    outputGroupedByKey(key: keyof T | string, output: (key: string, itemList: FoundList<T>) => string): string;
    outputEach(output: (item: FoundItem<T>) => string, opt?: {
        delimiter?: string;
    }): string;
    outputEachEntry(output: (item: {
        key: string;
        v: FoundItemValue;
    }) => string): string;
}
