import FoundItem from './FoundItem';
import FoundItemValue from './FoundItemValue';
import { AllowKeys } from './types';

/**
 * コメント注釈全ファイル文のデータ
 */
export default class FoundList<T extends AllowKeys> {
    constructor(public list: FoundItem<T>[] = []) {}

    push(v): void {
        this.list.push(v);
    }

    filter(cb: (item: FoundItem<T>) => boolean): FoundList<T> {
        return new FoundList(this.list.filter(cb));
    }

    /**
   * @param {function} [logic]
   */
    sortByLogic(logic: (item: FoundItem<T>) => string): FoundList<T> {
        return new FoundList(
            [...this.list].sort((aItem, bItem) => {
                const a = logic(aItem);
                const b = logic(bItem);
                if (a < b) return -1;
                else if (a > b) return 1;
                else return 0;
            }),
        );
    }

    /**
   * @param key
   * @param rewriteVal - 指定した場合は取得した値を書き換えてソートの基準にする
   */
    sortByKey(
        key: string,
        rewriteVal: (v: string) => string = null,
    ): FoundList<T> {
        if (!rewriteVal) rewriteVal = (v: string): string => v;
        return this.filter(item => {
            return item.has(key);
        }).sortByLogic(item => {
            return rewriteVal(item.get(key).toString());
        });
    }

    sortByOrders(key: string, orders: string[]): FoundList<T> {
        const k2i = {};
        orders.forEach((k, i) => (k2i[k] = i));
        return this.sortByKey(key, v => {
            return v in k2i ? k2i[v] : orders.length;
        });
    }

    outputGroupedByKey(
        key: keyof T | string,
        output: (key: string, itemList: FoundList<T>) => string,
    ): string {
        const groupedKey = []; // キーの登場順を保持
        const groupedValues: { [key: string]: FoundList<T> } = {};
        for (const item of this.list) {
            if (item.has(key)) {
                // キーを持っている場合のみ処理する
                const valOfKey = item.get(key).toString();
                if (!groupedValues[valOfKey]) {
                    groupedKey.push(valOfKey);
                    groupedValues[valOfKey] = new FoundList();
                }
                groupedValues[valOfKey].push(item);
            }
        }
        return groupedKey.map(key => output(key, groupedValues[key])).join('');
    }

    outputEach(
        output: (item: FoundItem<T>) => string,
        opt: { delimiter?: string } = {},
    ): string {
        return this.list.map(item => output(item)).join(opt.delimiter || '');
    }

    outputEachEntry(
        output: (item: { key: string; v: FoundItemValue }) => string,
    ): string {
        const contents: string[] = [];
        for (const file of this.list) {
            for (const entry of file.entries()) {
                contents.push(output(entry));
            }
        }
        return contents.join('');
    }
}
