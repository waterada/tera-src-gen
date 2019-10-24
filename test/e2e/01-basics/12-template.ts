import gen from './01-collecting';

gen.insertIntoFile(
    `${__dirname}/output/22-target.yaml`,
    {
        from: '# ↓ここから自動生成\n',
        to: '# ↑ここまで自動生成\n',
    },
    ({ fileItems }) => `\
files:
${fileItems.sortByKey('fileName').outputEach(item => `\
  - "${item.fileName}"
`)}\
`);
