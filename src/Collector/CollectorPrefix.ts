import Collector from './Collector';

export default class CollectorPrefix extends Collector {
    constructor(private __prefix: string) {
        super();
    }

    extract(
        text: string,
        appender: (oneFound: { [key: string]: string }) => void,
    ): void {
        text.split('\n').forEach(line => {
            if (line.startsWith(this.__prefix)) {
                console.log('annotation', line);
                const matches = line
                    .substr(this.__prefix.length)
                    .match(/^\s+([\w.-]+):(.*)/);
                if (matches) {
                    const key = matches[1];
                    const val = matches[2].trim();
                    appender({ [key]: val });
                }
            }
        });
    }
}
