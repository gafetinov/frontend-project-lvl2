import { compareObjects } from '../src/comparator.js';
import { fieldStatuses } from '../src/shared.js';


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
        value: {
          timeout: { value: 20, prev: 50, status: fieldStatuses.modified },
          host: { value: 'hexlet.io', prev: 'hexlet.io', status: fieldStatuses.unmodified },
          proxy: { value: undefined, prev: '123.234.53.22', status: fieldStatuses.deleted },
          follow: { value: undefined, prev: false, status: fieldStatuses.deleted },
          verbose: { value: true, prev: undefined, status: fieldStatuses.added },
        },
        status: fieldStatuses.deep,
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
        value: {
          timeout: { value: undefined, prev: 20, status: fieldStatuses.deleted },
          verbose: { value: undefined, prev: true, status: fieldStatuses.deleted },
          host: { value: undefined, prev: 'hexlet.io', status: fieldStatuses.deleted },
          timeout2: { value: 20, prev: undefined, status: fieldStatuses.added },
          verbose2: { value: true, prev: undefined, status: fieldStatuses.added },
          host2: { value: 'hexlet.io', prev: undefined, status: fieldStatuses.added },
        },
        status: fieldStatuses.deep,
      };
      expect(compareObjects(c, d)).toEqual(rightCompare);
    });
    test('should compare emptyObjects', () => {
      const compareToEmpty = compareObjects(a, {});
      const rightCompareToEmpty = {
        value: {
          timeout: { value: undefined, prev: 50, status: fieldStatuses.deleted },
          follow: { value: undefined, prev: false, status: fieldStatuses.deleted },
          host: { value: undefined, prev: 'hexlet.io', status: fieldStatuses.deleted },
          proxy: { value: undefined, prev: '123.234.53.22', status: fieldStatuses.deleted },
        },
        status: fieldStatuses.deep,
      };
      expect(compareToEmpty).toEqual(rightCompareToEmpty);

      const compareFromEmpty = compareObjects({}, b);
      const rightCompareFromEmpty = {
        value: {
          timeout: { value: 20, prev: undefined, status: fieldStatuses.added },
          verbose: { value: true, prev: undefined, status: fieldStatuses.added },
          host: { value: 'hexlet.io', prev: undefined, status: fieldStatuses.added },
        },
        status: fieldStatuses.deep,
      };
      expect(compareFromEmpty).toEqual(rightCompareFromEmpty);

      expect(compareObjects({}, {})).toEqual({ value: {}, status: fieldStatuses.deep });
    });
    test('should compare identical Objects', () => {
      const compare = compareObjects(a, a);
      const rightCompare = {
        value: {
          timeout: { value: 50, prev: 50, status: fieldStatuses.unmodified },
          follow: { value: false, prev: false, status: fieldStatuses.unmodified },
          host: { value: 'hexlet.io', prev: 'hexlet.io', status: fieldStatuses.unmodified },
          proxy: { value: '123.234.53.22', prev: '123.234.53.22', status: fieldStatuses.unmodified },
        },
        status: fieldStatuses.deep,
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
        value: {
          common: {
            value: {
              setting1: { value: 'Value 1', prev: 'Value 1', status: fieldStatuses.unmodified },
              setting2: { value: 200, prev: 200, status: fieldStatuses.unmodified },
              setting3: { value: true, prev: true, status: fieldStatuses.unmodified },
              setting6: {
                value: {
                  key: { value: 'value', prev: 'value', status: fieldStatuses.unmodified },
                },
                status: fieldStatuses.deep,
              },
            },
            status: fieldStatuses.deep,
          },
          key: { value: 12, prev: 12, status: fieldStatuses.unmodified },
          arr: {
            value: [
              { value: 1, prev: 1, status: fieldStatuses.unmodified },
              { value: 2, prev: 2, status: fieldStatuses.unmodified },
              { value: 4, prev: 4, status: fieldStatuses.unmodified },
            ],
            status: fieldStatuses.iterable,
          },
        },
        status: fieldStatuses.deep,
      };
      expect(compare).toEqual(rightCompare);
    });
    it('should compare objects with nesting', () => {
      const compare = compareObjects(a, b);
      const rightCompare = {
        value: {
          common: {
            value: {
              setting1: { value: 'Value 2', prev: 'Value 1', status: fieldStatuses.modified },
              setting2: { value: 200, prev: 200, status: fieldStatuses.unmodified },
              setting3: { value: true, prev: true, status: fieldStatuses.unmodified },
              setting6: {
                value: {
                  key: { value: 'value2', prev: 'value', status: fieldStatuses.modified },
                  follow: { value: { proxy: '8.8.8.8', num: 21 }, prev: undefined, status: fieldStatuses.added },
                },
                status: fieldStatuses.deep,
              },
            },
            status: fieldStatuses.deep,
          },
          key: { value: 12, prev: 12, status: fieldStatuses.unmodified },
          arr: {
            value: [
              { value: 1, prev: 1, status: fieldStatuses.unmodified },
              { value: 3, prev: 2, status: fieldStatuses.modified },
              { value: undefined, prev: 4, status: fieldStatuses.deleted },
            ],
            status: fieldStatuses.iterable,
          },
        },
        status: fieldStatuses.deep,
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
        value: {
          field: { value: 'flat', prev: { key: 'value' }, status: fieldStatuses.modified },
        },
        status: fieldStatuses.deep,
      };
      expect(comparingObjectAndFlat).toEqual(rightComparingObjectAndFlat);

      const comparingArrayAndObject = compareObjects(arrayField, objectField);
      const rightComparingArrayAndObject = {
        value: {
          field: { value: { key: 'value' }, prev: [1, 2], status: fieldStatuses.modified },
        },
        status: fieldStatuses.deep,
      };
      expect(comparingArrayAndObject).toEqual(rightComparingArrayAndObject);
    });
    it('should compare objects inside arrays', () => {
      const c = { arr: [{ count: 32 }, 23, [1, 2]] };
      const d = { arr: [{ count: 21 }, { num: 23 }, [1, 3, 5]] };
      const correctCompare = {
        value: {
          arr: {
            value: [
              {
                value: { count: { value: 21, prev: 32, status: fieldStatuses.modified } },
                status: fieldStatuses.deep,
              },
              { value: { num: 23 }, prev: 23, status: fieldStatuses.modified },
              {
                value: [
                  { value: 1, prev: 1, status: fieldStatuses.unmodified },
                  { value: 3, prev: 2, status: fieldStatuses.modified },
                  { value: 5, prev: undefined, status: fieldStatuses.added },
                ],
                status: fieldStatuses.iterable,
              },
            ],
            status: fieldStatuses.iterable,
          },
        },
        status: fieldStatuses.deep,
      };
      const compare = compareObjects(c, d);
      expect(compare).toEqual(correctCompare);
    });
  });
});
