import genDiff from '../src';
import { outputFormats } from '../src/shared.js';

describe('compareFiles', () => {
  const rightCompare = [
    '{',
    '    host: hexlet.io',
    '  - timeout: 50',
    '  + timeout: 20',
    '  - proxy: 123.234.53.22',
    '  - follow: false',
    '  + verbose: true',
    '}',
  ].join('\n');

  const genCompare = (fileNameEnd, outputFormat) => genDiff(
    `${__dirname}/../__fixtures__/before${fileNameEnd}`,
    `${__dirname}/../__fixtures__/after${fileNameEnd}`,
    outputFormat,
  );

  test('should compare JSON files', () => {
    expect(genCompare('.json')).toBe(rightCompare);
  });
  test('should compare YAML files', () => {
    expect(genCompare('.yaml')).toBe(rightCompare);
    expect(genCompare('.yml')).toBe(rightCompare);
  });
  test('should compare .ini files', () => {
    expect(genCompare('.ini')).toBe(rightCompare);
  });
  test('should generate volume compare', () => {
    const rightDeepCompare = [
      '{',
      '    common: {',
      '        setting1: Value 1',
      '      - setting2: 200',
      '      - setting3: true',
      '      + setting3: {',
      '            key: value',
      '        }',
      '        setting6: {',
      '            key: value',
      '          + ops: vops',
      '        }',
      '      + follow: false',
      '      + setting4: blah blah',
      '      + setting5: {',
      '            key5: value5',
      '        }',
      '    }',
      '    group1: {',
      '      - baz: bas',
      '      + baz: bars',
      '        foo: bar',
      '      - nest: {',
      '            key: value',
      '        }',
      '      + nest: str',
      '    }',
      '  - group2: {',
      '        abc: 12345',
      '    }',
      '  + group3: {',
      '        fee: 100500',
      '    }',
      '}',
    ].join('\n');
    const compare = genCompare('-deep.json');
    expect(compare).toBe(rightDeepCompare);
  });
  it('should generate plain compare', () => {
    const correctCompare = [
      'Property \'common.setting2\' was removed',
      'Property \'common.setting3\' was updated. From true to [complex value]',
      'Property \'common.setting6.ops\' was added with value: \'vops\'',
      'Property \'common.follow\' was added with value: false',
      'Property \'common.setting4\' was added with value: \'blah blah\'',
      'Property \'common.setting5\' was added with value: [complex value]',
      'Property \'group1.baz\' was updated. From \'bas\' to \'bars\'',
      'Property \'group1.nest\' was updated. From [complex value] to \'str\'',
      'Property \'group2\' was removed',
      'Property \'group3\' was added with value: [complex value]',
    ].join('\n');
    const compare = genCompare('-deep.json', outputFormats.plain);
    expect(compare).toBe(correctCompare);
  });
  it('should generate json compare', () => {
    const correctStr = [
      '{',
      '  "value": {',
      '    "common": {',
      '      "value": {',
      '        "setting1": {',
      '          "value": "Value 1",',
      '          "prev": "Value 1",',
      '          "status": "unmodified"',
      '        },',
      '        "setting2": {',
      '          "prev": 200,',
      '          "status": "deleted"',
      '        },',
      '        "setting3": {',
      '          "value": {',
      '            "key": "value"',
      '          },',
      '          "prev": true,',
      '          "status": "modified"',
      '        },',
      '        "setting6": {',
      '          "value": {',
      '            "key": {',
      '              "value": "value",',
      '              "prev": "value",',
      '              "status": "unmodified"',
      '            },',
      '            "ops": {',
      '              "value": "vops",',
      '              "status": "added"',
      '            }',
      '          },',
      '          "status": "deep"',
      '        },',
      '        "follow": {',
      '          "value": false,',
      '          "status": "added"',
      '        },',
      '        "setting4": {',
      '          "value": "blah blah",',
      '          "status": "added"',
      '        },',
      '        "setting5": {',
      '          "value": {',
      '            "key5": "value5"',
      '          },',
      '          "status": "added"',
      '        }',
      '      },',
      '      "status": "deep"',
      '    },',
      '    "group1": {',
      '      "value": {',
      '        "baz": {',
      '          "value": "bars",',
      '          "prev": "bas",',
      '          "status": "modified"',
      '        },',
      '        "foo": {',
      '          "value": "bar",',
      '          "prev": "bar",',
      '          "status": "unmodified"',
      '        },',
      '        "nest": {',
      '          "value": "str",',
      '          "prev": {',
      '            "key": "value"',
      '          },',
      '          "status": "modified"',
      '        }',
      '      },',
      '      "status": "deep"',
      '    },',
      '    "group2": {',
      '      "prev": {',
      '        "abc": 12345',
      '      },',
      '      "status": "deleted"',
      '    },',
      '    "group3": {',
      '      "value": {',
      '        "fee": 100500',
      '      },',
      '      "status": "added"',
      '    }',
      '  },',
      '  "status": "deep"',
      '}',
    ].join('\n');
    const compare = genCompare('-deep.json', outputFormats.json);
    expect(compare).toBe(correctStr);
  });
});
