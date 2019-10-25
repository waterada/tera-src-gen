"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const FoundItem_1 = require("./FoundItem");
const FoundList_1 = require("./FoundList");
class TeraSrcGen {
    constructor(_items = [], _fileItems = [], _allowKeys = {}) {
        this._items = _items;
        this._fileItems = _fileItems;
        this._allowKeys = _allowKeys;
    }
    allowKeys(allowKeys) {
        return new TeraSrcGen(this._items.map(item => item.allowKeys(allowKeys)), this._fileItems.map(item => item.allowKeys(allowKeys)), allowKeys);
    }
    __resolvePath(pathStr) {
        return path.resolve(pathStr);
    }
    __fs() {
        return fs;
    }
    __globSync(pattern) {
        return glob.sync(pattern);
    }
    _globFiles(targetGlobs) {
        let files = [];
        for (const g of targetGlobs) {
            files = files.concat(this.__globSync(this.__resolvePath(g)));
        }
        return files;
    }
    _collectItems(files, collector) {
        const items = [];
        const fileItems = [];
        for (const file of files) {
            const baseName = path.basename(file);
            const fileItem = new FoundItem_1.default(baseName, this._allowKeys);
            let fileItemIsEmpty = true;
            const text = this.__fs().readFileSync(file, { encoding: 'utf8' });
            const appender = (oneFound) => {
                items.push(new FoundItem_1.default(baseName, this._allowKeys).setAll(oneFound));
                fileItem.setAll(oneFound);
                fileItemIsEmpty = false;
            };
            collector.extract(text, appender);
            if (!fileItemIsEmpty) {
                fileItems.push(fileItem);
            }
        }
        return { items, fileItems };
    }
    collectItems(opt) {
        const files = this._globFiles(opt.targetGlobs);
        console.log('found files:', files.length);
        const { items, fileItems } = this._collectItems(files, opt.collector);
        console.log('annotated files:', fileItems.length);
        console.log('annotated lines:', items.length);
        if (items.length === 0) {
            throw new Error('コメント注釈が見つかりませんでした。');
        }
        this._items = items;
        this._fileItems = fileItems;
        if (opt.allowKeys)
            this._allowKeys = opt.allowKeys;
        return this;
    }
    __render(template) {
        return template({
            items: new FoundList_1.default(this._items),
            fileItems: new FoundList_1.default(this._fileItems),
        });
    }
    outputFile(filePath, template) {
        filePath = this.__resolvePath(filePath);
        this.__fs().writeFileSync(filePath, this.__render(template), {
            encoding: 'utf8',
        });
        console.log('output:', filePath);
    }
    insertIntoFile(filePath, opt, template) {
        filePath = this.__resolvePath(filePath);
        const text = this.__fs().readFileSync(filePath, { encoding: 'utf8' });
        const idxFrom = text.indexOf(opt.from) + opt.from.length;
        const idxTo = text.indexOf(opt.to);
        if (idxFrom === -1)
            throw new Error(`from(${opt.from})で指定された行がfilePath(${filePath})に見つかりません。`);
        if (idxTo === -1)
            throw new Error(`from(${opt.from})で指定された行がfilePath(${filePath})に見つかりません。`);
        const replaced = text.substring(0, idxFrom) +
            this.__render(template) +
            text.substring(idxTo);
        this.__fs().writeFileSync(filePath, replaced, { encoding: 'utf8' });
        console.log('output(insertInto):', filePath);
    }
}
exports.default = TeraSrcGen;
