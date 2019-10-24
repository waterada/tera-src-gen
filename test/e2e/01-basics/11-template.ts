import gen from './01-collecting';

gen.outputFile(
    `${__dirname}/output/21-target.yaml`,
    ({ fileItems }) => `\
StartOfFile: 111

# 特殊な文字の表現
SpecialCharacters:
    - \$
    - \\

# 改行したくないとき
DontBreak: aaa\
bbb

# コメント(値は出力されない)
Comment: "${'' /* 出力されない */}"

# annotations.sortByLogic
# 下記のような出現に対してソートする
# @TEST non-api: True
# @TEST api: /aaa/bbb POST
# @TEST api: /aaa/bbb GET
sortByLogic:
${fileItems.sortByLogic(item => {
        if (item.has('non-api')) {
            return `2 ${item.fileBaseSnake}`; // 末尾
        } else {
            const k2i = {};
            ['GET', 'POST', 'PUT', 'DELETE'].forEach((k, i) => (k2i[k] = i + 1));
            return `1 ${item.get('api[0]')} ${k2i[item.get('api[1]').value] || 9}`;
        }
    }).outputEach(item => `\
${'' /*LOOP_NAME START*/}\
  # api: "${item.get('api')}"
  # special: "${item.get('special')}"
  - fileName: ${item.fileName}
    fileBase: ${item.fileBase}
    fileBaseCamel: ${item.fileBaseCamel}
    fileBaseSnake: ${item.fileBaseSnake}
    # item.outputIf('special')
${item.get('special').output(v => `\
    special: "${v}"
`)}\
    # item.outputIf(special[0])
${item.get('special-0').output(v => `\
    special-0: "${v}"
`)}\
    # item.outputIf(special[1])
${item.get('special').at(1).output(v => `\
    special-1: "${v}"
`)}\
    # item.outputIf(special-map)
${item.get('special').output((v, obj) => `\
    special-map:
      First: ${obj.at(0)}
      Second: ${obj.at(1)}
`)}\
    # item.outputIf(specialがあればその値、そうでなければ GET なら GHI そうでないなら JKL)
${item.get('special').orDefault(item.get('api[1]').value === 'GET' ? 'GHI' : 'JKL').output(v => `\
    special-default: "${v} (api[1]: ${item.get('api[1]')})"
`)}\
${'' /*LOOP_NAME END*/}`)}\

# sortByKey('api[0]') ※ 0 は api もっていないので非表示
sortByKey:
${fileItems.sortByKey('api[0]').outputEach(item => `\
  - ${item.fileName} (api: ${item.get('api')})
`)}\

# filter(item => item.has('non-api')) -- test_file_0 のみヒット
non-filter:
${fileItems.outputEach(item => `\
  - "${item.fileName} (non-api: ${item.get('non-api')})"
`)}\
filter:
${fileItems.filter(item => item.has('non-api')).outputEach(item => `\
  - "${item.fileName} (non-api: ${item.get('non-api')})"
`)}\

# outputGroupedByKey('api[0]', (path, grouped_list) => ...) -- 4, 3, 2, 1, 5 の順 (0はapi[0]がないため非表示)
outputGroupedByKey:
${fileItems.outputGroupedByKey('api[0]', (path, groupedList) => `\
  ${path}:
${'' /**/}${groupedList.sortByOrders('api[1]', ['GET', 'POST', 'PUT', 'DELETE']).outputEach(item => `\
    ${item.get('api[1]').value.toLowerCase()}: "${item.fileName} (api: ${item.get('api')})"
${'' /**/}`)}\
`)}\
`);
