import { fieldStatuses } from '../../src/shared.js';
import plain from '../../src/formatters/plain.js';

describe('plain', () => {
  it('should gen string of compare deep objects', () => {
    const compare = {
      value: {
        setting1: {
          value: {
            added: { value: { add: 'add' }, prev: undefined, status: fieldStatuses.added },
            deleted: { value: undefined, prev: 'del', status: fieldStatuses.deleted },
            modified: { value: 'after', prev: { before: 'before' }, status: fieldStatuses.modified },
            unmodified: { value: 'stat', prev: 'stat', status: fieldStatuses.unmodified },
          },
          status: fieldStatuses.deep,
        },
        setting2: { value: 'ew', prev: false, status: fieldStatuses.modified },
      },
      status: fieldStatuses.deep,
    };
    const correctPlainStr = [
      "Property 'setting1.added' was added with value: [complex value]",
      "Property 'setting1.deleted' was removed",
      "Property 'setting1.modified' was updated. From [complex value] to 'after'",
      "Property 'setting2' was updated. From false to 'ew'",
    ].join('\n');
    expect(plain(compare)).toEqual(correctPlainStr);
  });
  it('should gen string of compare with arrays', () => {
    const compare = {
      value: {
        arr: {
          value: [
            { value: 'added', prev: undefined, status: fieldStatuses.added },
            { value: 'new', prev: [], status: fieldStatuses.modified },
            { value: undefined, prev: [1, 2, 3], status: fieldStatuses.deleted },
            { value: 'stat', prev: 'stat', status: fieldStatuses.unmodified },
            {
              value: {
                key: { value: 'after', prev: 'before', status: fieldStatuses.modified },
              },
              status: fieldStatuses.deep,
            },
            {
              value: [
                { value: 1, prev: false, status: fieldStatuses.modified },
                { value: undefined, prev: 2, status: fieldStatuses.deleted },
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
      "Property 'arr[0]' was added with value: 'added'",
      "Property 'arr[1]' was updated. From [complex value] to 'new'",
      "Property 'arr[2]' was removed",
      "Property 'arr[4].key' was updated. From 'before' to 'after'",
      "Property 'arr[5][0]' was updated. From false to 1",
      "Property 'arr[5][1]' was removed",
    ].join('\n');
    expect(plain(compare)).toEqual(correctStr);
  });
});
