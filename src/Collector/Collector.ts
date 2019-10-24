/* eslint-disable @typescript-eslint/no-unused-vars */
export default class Collector {
    extract (
        text: string,
        appender: (oneFound: { [key: string]: string }) => void,
    ): void {
        throw new Error('Should override this');
    }
}
