export default class FoundItemValue {
    value: string;
    private _exists;
    constructor(value: string, _exists?: boolean);
    orDefault(v: string): FoundItemValue;
    exists(): boolean;
    at(i: number): FoundItemValue;
    json(key: string): string;
    output(cb: (v: string, obj: FoundItemValue) => string): string;
    toString(): string;
    [Symbol.toPrimitive](): string;
    static createBlank(): FoundItemValue;
    static snake2camel(str: string): string;
    static camel2snake(str: string): string;
}
