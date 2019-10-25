"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
class Collector {
    extract(text, appender) {
        throw new Error('Should override this');
    }
}
exports.default = Collector;
