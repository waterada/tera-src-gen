import gen from '../collecting';

gen.outputFile(
    `${__dirname}/path-to-output-file.yaml`,
    ({ fileItems }) => `\
# START
${fileItems.outputEach(item => `\
  - "${item.fileName} (api: '${item.get('api')}')"
`)}\
# END
`);
