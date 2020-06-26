import genDiff from '../src/index.js';
import { fieldStatuses, compareObjects } from '../src/comparator.js';


describe('compareObjects', () => {
  describe('Comparing flat objects', () => {
    const a = {
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    };

    const b = {
      timeout: 20,
      verbose: true,
      host: 'hexlet.io',
    };
    test('should compare flat objects with similarities', () => {
      const compare = compareObjects(a, b);
      const rightCompare = {
        timeout: { value: 20, prev: 50, status: fieldStatuses.modified },
        host: { value: 'hexlet.io', prev: 'hexlet.io', status: fieldStatuses.unmodified },
        proxy: { value: undefined, prev: '123.234.53.22', status: fieldStatuses.deleted },
        follow: { value: undefined, prev: false, status: fieldStatuses.deleted },
        verbose: { value: true, prev: undefined, status: fieldStatuses.added },
      };
      expect(compare).toEqual(rightCompare);
    });
    test('should compare absolutely different flat objects', () => {
      const c = {
        timeout: 20,
        verbose: true,
        host: 'hexlet.io',
      };
      const d = {
        timeout2: 20,
        verbose2: true,
        host2: 'hexlet.io',
      };
      const rightCompare = {
        timeout: { value: undefined, prev: 20, status: fieldStatuses.deleted },
        verbose: { value: undefined, prev: true, status: fieldStatuses.deleted },
        host: { value: undefined, prev: 'hexlet.io', status: fieldStatuses.deleted },
        timeout2: { value: 20, prev: undefined, status: fieldStatuses.added },
        verbose2: { value: true, prev: undefined, status: fieldStatuses.added },
        host2: { value: 'hexlet.io', prev: undefined, status: fieldStatuses.added },
      };
      expect(compareObjects(c, d)).toEqual(rightCompare);
    });
    test('should compare emptyObjects', () => {
      const compareToEmpty = compareObjects(a, {});
      const rightCompareToEmpty = {
        timeout: { value: undefined, prev: 50, status: fieldStatuses.deleted },
        follow: { value: undefined, prev: false, status: fieldStatuses.deleted },
        host: { value: undefined, prev: 'hexlet.io', status: fieldStatuses.deleted },
        proxy: { value: undefined, prev: '123.234.53.22', status: fieldStatuses.deleted },
      };
      expect(compareToEmpty).toEqual(rightCompareToEmpty);

      const compareFromEmpty = compareObjects({}, b);
      const rightCompareFromEmpty = {
        timeout: { value: 20, prev: undefined, status: fieldStatuses.added },
        verbose: { value: true, prev: undefined, status: fieldStatuses.added },
        host: { value: 'hexlet.io', prev: undefined, status: fieldStatuses.added },
      };
      expect(compareFromEmpty).toEqual(rightCompareFromEmpty);

      expect(compareObjects({}, {})).toEqual({});
    });
    test('should compare identical Objects', () => {
      const compare = compareObjects(a, a);
      const rightCompare = {
        timeout: { value: 50, prev: 50, status: fieldStatuses.unmodified },
        follow: { value: false, prev: false, status: fieldStatuses.unmodified },
        host: { value: 'hexlet.io', prev: 'hexlet.io', status: fieldStatuses.unmodified },
        proxy: { value: '123.234.53.22', prev: '123.234.53.22', status: fieldStatuses.unmodified },
      };
      expect(compare).toEqual(rightCompare);
    });
  });
  describe('Comparing objects with deep nesting', () => {
    const a = {
      common: {
        setting1: 'Value 1',
        setting2: 200,
        setting3: true,
        setting6: {
          key: 'value',
        },
      },
      key: 12,
      arr: [1, 2, 4],
    };
    const b = {
      common: {
        setting1: 'Value 2',
        setting2: 200,
        setting3: true,
        setting6: {
          key: 'value2',
          follow: {
            proxy: '8.8.8.8',
            num: 21,
          },
        },
      },
      key: 12,
      arr: [1, 3],
    };
    it('should compare equal objects', () => {
      const compare = compareObjects(a, a);
      const rightCompare = {
        common: {
          setting1: { value: 'Value 1', prev: 'Value 1', status: fieldStatuses.unmodified },
          setting2: { value: 200, prev: 200, status: fieldStatuses.unmodified },
          setting3: { value: true, prev: true, status: fieldStatuses.unmodified },
          setting6: { key: { value: 'value', prev: 'value', status: fieldStatuses.unmodified } },
        },
        key: { value: 12, prev: 12, status: fieldStatuses.unmodified },
        arr: [
          { value: 1, prev: 1, status: fieldStatuses.unmodified },
          { value: 2, prev: 2, status: fieldStatuses.unmodified },
          { value: 4, prev: 4, status: fieldStatuses.unmodified },
        ],
      };
      expect(compare).toEqual(rightCompare);
    });
    it('should compare objects with nesting', () => {
      const compare = compareObjects(a, b);
      const rightCompare = {
        common: {
          setting1: { value: 'Value 2', prev: 'Value 1', status: fieldStatuses.modified },
          setting2: { value: 200, prev: 200, status: fieldStatuses.unmodified },
          setting3: { value: true, prev: true, status: fieldStatuses.unmodified },
          setting6: {
            key: { value: 'value2', prev: 'value', status: fieldStatuses.modified },
            follow: { value: { proxy: '8.8.8.8', num: 21 }, prev: undefined, status: fieldStatuses.added },
          },
        },
        key: { value: 12, prev: 12, status: fieldStatuses.unmodified },
        arr: [
          { value: 1, prev: 1, status: fieldStatuses.unmodified },
          { value: 3, prev: 2, status: fieldStatuses.modified },
          { value: undefined, prev: 4, status: fieldStatuses.deleted },
        ],
      };
      expect(compare).toEqual(rightCompare);
    });
    it('should compare fields of different types', () => {
      const objectField = {
        field: {
          key: 'value',
        },
      };
      const flatField = {
        field: 'flat',
      };
      const arrayField = {
        field: [1, 2],
      };

      const comparingObjectAndFlat = compareObjects(objectField, flatField);
      const rightComparingObjectAndFlat = {
        field: { value: 'flat', prev: { key: 'value' }, status: fieldStatuses.modified },
      };
      expect(comparingObjectAndFlat).toEqual(rightComparingObjectAndFlat);

      const comparingArrayAndObject = compareObjects(arrayField, objectField);
      const rightComparingArrayAndObject = {
        field: { value: { key: 'value' }, prev: [1, 2], status: fieldStatuses.modified },
      };
      expect(comparingArrayAndObject).toEqual(rightComparingArrayAndObject);
    });
  });
});


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
      '      + follow: false',
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
      '      + setting4: blah blah',
      '      + setting5: {',
      '            key5: value5',
      '        }',
      '    }',
      '    group1: {',
      '      + baz: bars',
      '      - baz: bas',
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
    expect(compare('-deep.json')).toBe(rightDeepCompare);
  });
});
