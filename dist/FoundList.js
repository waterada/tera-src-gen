"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * コメント注釈全ファイル文のデータ
 */
class FoundList {
    constructor(list = []) {
        this.list = list;
    }
    push(v) {
        this.list.push(v);
    }
    filter(cb) {
        return new FoundList(this.list.filter(cb));
    }
    /**
     * @param {function} [logic]
     */
    sortByLogic(logic) {
        return new FoundList([...this.list].sort((aItem, bItem) => {
            const a = logic(aItem);
            const b = logic(bItem);
            if (a < b)
                return -1;
            else if (a > b)
                return 1;
            else
                return 0;
        }));
    }
    /**
     * @param key
     * @param rewriteVal - 指定した場合は取得した値を書き換えてソートの基準にする
     */
    sortByKey(key, rewriteVal = v => v) {
        return this.filter(item => {
            return item.has(key);
        }).sortByLogic(item => {
            return rewriteVal(item.get(key).toString());
        });
    }
    sortByOrders(key, orders) {
        const k2i = {};
        orders.forEach((k, i) => (k2i[k] = i));
        return this.sortByKey(key, v => {
            return v in k2i ? k2i[v] : orders.length;
        });
    }
    outputGroupedByKey(key, output) {
        const groupedKey = []; // キーの登場順を保持
        const groupedValues = {};
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
    outputEach(output, opt = {}) {
        return this.list.map(item => output(item)).join(opt.delimiter || '');
    }
    outputEachEntry(output) {
        const contents = [];
        for (const file of this.list) {
            for (const entry of file.entries()) {
                contents.push(output(entry));
            }
        }
        return contents.join('');
    }
}
exports.default = FoundList;
