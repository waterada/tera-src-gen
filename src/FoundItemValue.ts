export default class FoundItemValue {
    constructor (public value: string, private _exists: boolean = true) {
    }

    orDefault (v: string): FoundItemValue {
        if (this._exists) {
            return this;
        } else {
            return new FoundItemValue(v);
        }
    }

    exists (): boolean {
        return this._exists;
    }

    at (i: number): FoundItemValue {
        if (this._exists) {
            const split = this.value.split(/\s+/);
            if (i in split) {
                return new FoundItemValue(split[i]);
            }
        }
        return FoundItemValue.createBlank();
    }

    json (key: string): string {
        return JSON.parse(this.value)[key];
    }

    output (cb: (v: string, obj: FoundItemValue) => string): string {
        return this._exists ? cb(this.value, this) : '';
    }

    toString (): string {
        return this.value;
    }

    [Symbol.toPrimitive] (): string {
        return this.value;
    }

    static createBlank (): FoundItemValue {
        return new FoundItemValue('', false);
    }

    static snake2camel (str): void | string {
        str = str.replace(/(?:^|_)([a-z0-9])/g, (__, s) => s.toUpperCase());
        return str.replace(/_/g, '', str);
    }

    static camel2snake (str): string {
        str = str.replace(/(.)([A-Z][a-z]+)/g, '$1_$2');
        return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
    }
}
