export default class Collector {
    extract(text: string, appender: (oneFound: {
        [key: string]: string;
    }) => void): void;
}
