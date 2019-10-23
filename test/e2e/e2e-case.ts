import fs = require('fs');
import path = require('path');

export default class E2eCase {
    constructor(
    public dir: string,
    public files: { TARGET: string; EXPECTED: string },
    public copy: boolean = false,
    private paths: {
      SRC?: string;
      OUTPUT: string;
      EXPECTED: string;
    } = { OUTPUT: '', EXPECTED: '' },
    ) {
        this.paths.SRC = copy ? path.resolve(path.join(dir, files.TARGET)) : null;
        this.paths.OUTPUT = path.resolve(path.join(dir, 'output', files.TARGET));
        this.paths.EXPECTED = path.resolve(path.join(dir, files.EXPECTED));
    }

    initializeFiles() {
        E2eCase.unlink(this.paths.OUTPUT);
        if (this.paths.SRC) {
            fs.statSync(this.paths.SRC);
            fs.copyFileSync(this.paths.SRC, this.paths.OUTPUT);
        }
    }

    assertOutput() {
        expect(E2eCase.existsFile(this.paths.OUTPUT)).toBe(true);
        expect(E2eCase.readFile(this.paths.OUTPUT)).toBe(
            E2eCase.readFile(this.paths.EXPECTED),
        );
    }

    static unlink(path: string) {
        try {
            fs.unlinkSync(path);
        } catch (e) {
            // ファイルがないとエラーになるが何もしない
        }
    }

    static existsFile(path: string): boolean {
        try {
            return fs.statSync(path).isFile();
        } catch (e) {
            return false;
        }
    }

    static readFile(path: string) {
        return fs.readFileSync(path, { encoding: 'utf8' });
    }
}
