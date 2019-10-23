import * as fs from 'fs';
import * as path from 'path';

import Collector from './Collector/Collector';
import FoundItem from './FoundItem';
import FoundList from './FoundList';
import { AllowKeys } from './types';

export declare type Template<T extends AllowKeys> = (args: {
  items: FoundList<T>;
  fileItems: FoundList<T>;
}) => string;

export default class TeraSrcGen<T extends AllowKeys> {
    constructor(
    private _items: FoundItem<T>[] = [],
    private _fileItems: FoundItem<T>[] = [],
    private _allowKeys: T = {} as T,
    ) {}

    allowKeys<T2 extends T>(allowKeys: T2): TeraSrcGen<T2> {
        return new TeraSrcGen(
            this._items.map(item => item.allowKeys(allowKeys)),
            this._fileItems.map(item => item.allowKeys(allowKeys)),
            allowKeys,
        );
    }

    __resolvePath(pathStr: string): string {
        return path.resolve(pathStr);
    }

    __fs(): typeof fs {
        return fs;
    }

    _readDir(targetDirList: string[]): string[] {
        let files = [];
        for (const dir of targetDirList) {
            files = files.concat(
                this.__fs()
                    .readdirSync(this.__resolvePath(dir))
                    .map(file => {
                        return `${dir}/${file}`;
                    }),
            );
        }
        return files;
    }

    _filterFiles(files: string[], targetFileRegExp: RegExp): string[] {
        return files.filter(file => {
            return (
                this.__fs()
                    .statSync(file)
                    .isFile() && path.basename(file).match(targetFileRegExp)
            ); //絞り込み
        });
    }

    _collectItems(
        files: string[],
        collector: Collector,
    ): {
    items: FoundItem<T>[];
    fileItems: FoundItem<T>[];
  } {
        const items: FoundItem<T>[] = [];
        const fileItems: FoundItem<T>[] = [];
        for (const file of files) {
            const baseName = path.basename(file);
            const fileItem = new FoundItem<T>(baseName, this._allowKeys);
            let fileItemIsEmpty = true;
            const text = this.__fs().readFileSync(file, { encoding: 'utf8' });
            const appender = (oneFound: { [key: string]: string }): void => {
                items.push(
                    new FoundItem<T>(baseName, this._allowKeys).setAll(oneFound),
                );
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

    collectItems(opt: {
    targetDirList: string[];
    targetFileRegExp: RegExp;
    collector: Collector;
    allowKeys?: T;
  }): void {
        let files = this._readDir(opt.targetDirList);
        console.log('found files:', files.length);
        files = this._filterFiles(files, opt.targetFileRegExp);
        console.log('target files:', files.length);
        const { items, fileItems } = this._collectItems(files, opt.collector);
        console.log('annotated files:', fileItems.length);
        console.log('annotated lines:', items.length);
        if (items.length === 0) {
            throw new Error('コメント注釈が見つかりませんでした。');
        }
        this._items = items;
        this._fileItems = fileItems;
        if (opt.allowKeys) this._allowKeys = opt.allowKeys;
    }

    __render(template: Template<T>): string {
        return template({
            items: new FoundList(this._items),
            fileItems: new FoundList(this._fileItems),
        });
    }

    outputFile(filePath: string, template: Template<T>): void {
        filePath = this.__resolvePath(filePath);
        this.__fs().writeFileSync(filePath, this.__render(template), {
            encoding: 'utf8',
        });
        console.log('output:', filePath);
    }

    insertIntoFile(
        filePath: string,
        opt: { from: string; to: string },
        template: Template<T>,
    ): void {
        filePath = this.__resolvePath(filePath);
        const text = this.__fs().readFileSync(filePath, { encoding: 'utf8' });
        const idxFrom = text.indexOf(opt.from) + opt.from.length;
        const idxTo = text.indexOf(opt.to);
        if (idxFrom === -1)
            throw new Error(
                `from(${opt.from})で指定された行がfilePath(${filePath})に見つかりません。`,
            );
        if (idxTo === -1)
            throw new Error(
                `from(${opt.from})で指定された行がfilePath(${filePath})に見つかりません。`,
            );
        const replaced =
      text.substring(0, idxFrom) +
      this.__render(template) +
      text.substring(idxTo);
        this.__fs().writeFileSync(filePath, replaced, { encoding: 'utf8' });
        console.log('output(insertInto):', filePath);
    }
}
