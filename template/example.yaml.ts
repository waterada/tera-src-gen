import TeraSrcGen, { AllowKeys } from '../src';
export = (extractor: TeraSrcGen<AllowKeys>): void =>
    extractor.outputFile(
        '../path/to/output-file.yaml',
        ({ fileItems }) => `\
${fileItems.outputEach(
            item => `\
  - "${item.fileName}"
`,
        )}\
`,
    );
