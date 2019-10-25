import FoundItem from './FoundItem';
import FoundItemValue from './FoundItemValue';

export declare type AllowKeys = {
    [key: string]:
        | true
        | ((item: FoundItem<AllowKeys>) => (FoundItemValue | string));
};
