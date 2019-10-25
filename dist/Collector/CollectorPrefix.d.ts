import Collector from './Collector';
export default class CollectorPrefix extends Collector {
    private __prefix;
    constructor(__prefix: string);
    extract(text: string, appender: (oneFound: {
        [key: string]: string;
    }) => void): void;
}
