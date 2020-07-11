import { fieldStatuses } from '../src/comparator.js';
import stylish from '../src/stylish.js';

describe('stylish', () => {
  it('should gen string from comparing of two objects with nesting', () => {
    const compare = {
      common: {
        value: {
          setting: {
            value: {
              key: { value: 'value2', prev: 'value', status: fieldStatuses.modified },
              follow: { value: true, prev: undefined, status: fieldStatuses.added },
            },
          },
        },
      },
    };
    const correctStr = [
      '{',
      '    common: {',
      '        setting: {',
      '          - key: value',
      '          + key: value2',
      '          + follow: true',
      '        }',
      '    }',
      '}',
    ].join('\n');
    const style = stylish(compare);
    expect(style).toEqual(correctStr);
  });
  it('should gen string from comparing objects with added objects', () => {
    const compare = {
      setting: {
        value: {
          key: { value: 'value2', prev: 'value', status: fieldStatuses.modified },
          follow: {
            value: {
              proxy: '8.8.8.8', num: 21,
            },
            prev: undefined,
            status: fieldStatuses.added,
          },
        },
      },
    };
    const style = stylish(compare);
    console.log(style);
    const correctStr = [
      '{',
      '    setting: {',
      '      - key: value',
      '      + key: value2',
      '      + follow: {',
      '            proxy: 8.8.8.8',
      '            num: 21',
      '        }',
      '    }',
      '}',
    ].join('\n');
    expect(style).toEqual(correctStr);
  });
});
