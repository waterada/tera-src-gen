import gen from './0-collecting';

gen.insertIntoFile(
    `${__dirname}/output/2-target.yaml`,
    {
        from: '  # ↓ここから自動生成\n',
        to: '  # ↑ここまで自動生成\n',
    },
    ({ items }) => `\
${items.outputEachEntry(({ v }) => `\
  - File:
      Var1: "${v.json('Var1')}"
      Var2: "${v.json('Var2')}"
`)}\
`);
