import Collector from './Collector';
export default class CollectorCreateTableMysql extends Collector {
    extract(text: string, appender: (oneFound: {
        [key: string]: string;
    }) => void): void;
}
