import { fieldStatuses } from '../../src/shared.js';
import stylish from '../../src/formatters/stylish.js';

describe('stylish', () => {
  it('should gen string from comparing', () => {
    const compare = {
      value: {
        obj: {
          value: {
            deleted: { value: undefined, prev: 1, status: fieldStatuses.deleted },
            added: { value: [1], prev: undefined, status: fieldStatuses.added },
          },
          status: fieldStatuses.deep,
        },
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
    const correctStr = [
      '{',
      '    obj: {',
      '      - deleted: 1',
      '      + added: [',
      '            1',
      '        ]',
      '    }',
      '    arr: [',
      '        0: {',
      '          - count: 32',
      '          + count: 21',
      '        }',
      '      - 1: 23',
      '      + 1: {',
      '            num: 23',
      '        }',
      '        2: [',
      '            0: 1',
      '          - 1: 2',
      '          + 1: 3',
      '          + 2: 5',
      '        ]',
      '    ]',
      '}',
    ].join('\n');
    const style = stylish(compare);
    expect(style).toEqual(correctStr);
  });
});
