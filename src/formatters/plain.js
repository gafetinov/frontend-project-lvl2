import { fieldStatuses } from '../comparator.js';

const getValueString = (value) => {
  switch (typeof value) {
    case 'object':
      return '[complex value]';
    case 'string':
      return `'${value}'`;
    default:
      return String(value);
  }
};

const getRemovedStr = (path) => `Property '${path}' was removed`;
const getAddedStr = (path, value) => `Property '${path}' was added with value: ${getValueString(value)}`;
const getModifiedStr = (path, value, prev) => `Property '${path}' was updated. From ${getValueString(prev)} to ${getValueString(value)}`;

const getCompareString = (path, compare) => {
  const { status, value, prev } = compare;
  switch (status) {
    case fieldStatuses.deleted:
      return getRemovedStr(path);
    case fieldStatuses.added:
      return getAddedStr(path, value);
    case fieldStatuses.modified:
      return getModifiedStr(path, value, prev);
    case fieldStatuses.unmodified:
      return undefined;
    default:
      throw Error(`Not allowed gen compare string with status ${status}`);
  }
};

const plain = (initialCompare) => {
  const iter = (compare, path) => {
    const { value, status } = compare;
    if (status !== fieldStatuses.deep) {
      return getCompareString(path, compare);
    }
    return Object.keys(value)
      .map((key) => iter(value[key], `${path}${path ? '.' : ''}${key}`))
      .filter((x) => Boolean(x)).join('\n');
  };
  return iter(initialCompare, '');
};

export default plain;
