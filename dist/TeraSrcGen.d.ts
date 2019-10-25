/// <reference types="node" />
import * as fs from 'fs';
import Collector from './Collector/Collector';
import FoundItem from './FoundItem';
import FoundList from './FoundList';
import { AllowKeys } from './types';
export declare type Template<T extends AllowKeys> = (args: {
    items: FoundList<T>;
    fileItems: FoundList<T>;
}) => string;
export default class TeraSrcGen<T extends AllowKeys> {
    private _items;
    private _fileItems;
    private _allowKeys;
    constructor(_items?: FoundItem<T>[], _fileItems?: FoundItem<T>[], _allowKeys?: T);
    allowKeys<T2 extends T>(allowKeys: T2): TeraSrcGen<T2>;
    __resolvePath(pathStr: string): string;
    __fs(): typeof fs;
    __globSync(pattern: string): string[];
    _globFiles(targetGlobs: string[]): string[];
    _collectItems(files: string[], collector: Collector): {
        items: FoundItem<T>[];
        fileItems: FoundItem<T>[];
    };
    collectItems(opt: {
        targetGlobs: string[];
        collector: Collector;
        allowKeys?: T;
    }): TeraSrcGen<T>;
    __render(template: Template<T>): string;
    outputFile(filePath: string, template: Template<T>): void;
    insertIntoFile(filePath: string, opt: {
        from: string;
        to: string;
    }, template: Template<T>): void;
}
