import genDiff from '../src';

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

  const compare = (format) => genDiff(
    `${__dirname}/../__fixtures__/before${format}`,
    `${__dirname}/../__fixtures__/after${format}`,
  );

  test('should compare JSON files', () => {
    expect(compare('.json')).toBe(rightCompare);
  });
  test('should compare YAML files', () => {
    expect(compare('.yaml')).toBe(rightCompare);
    expect(compare('.yml')).toBe(rightCompare);
  });
  test('should compare .ini files', () => {
    expect(compare('.ini')).toBe(rightCompare);
  });
  test('should compare compare deep files', () => {
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
    const comp = compare('-deep.json');
    expect(comp).toBe(rightDeepCompare);
  });
});
