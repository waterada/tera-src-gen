"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collector_1 = require("./Collector");
class CollectorPrefix extends Collector_1.default {
    constructor(__prefix) {
        super();
        this.__prefix = __prefix;
    }
    extract(text, appender) {
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
exports.default = CollectorPrefix;
