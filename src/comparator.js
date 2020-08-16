import { types, getType, fieldStatuses } from './shared.js';

const isArrays = (...values) => values.every((value) => getType(value) === types.array);
const isFlats = (...values) => values.every((value) => getType(value) === types.flat);
const isDifferentTypes = (a, b) => getType(a) !== getType(b);
const isComparable = (a, b) => isFlats(a, b) || isArrays(a, b) || isDifferentTypes(a, b);
const areArraysEqual = (a, b) => !a.some((el, i) => el !== b[i]);

const isEqual = (a, b) => {
  if (isArrays(a, b)) return areArraysEqual(a, b);
  return a === b;
};

const compareValues = (prev, current) => {
  const compare = { value: current, prev };
  if (isEqual(prev, current)) {
    compare.status = fieldStatuses.unmodified;
  } else if (prev === undefined) {
    compare.status = fieldStatuses.added;
  } else if (current === undefined) {
    compare.status = fieldStatuses.deleted;
  } else {
    compare.status = fieldStatuses.modified;
  }
  return compare;
};

const compareData = (a, b) => {
  if (isComparable(a, b)) {
    return compareValues(a, b);
  }
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  const compare = keys.reduce((acc, key) => {
    acc[key] = compareData(a[key], b[key]);
    return acc;
  }, {});
  return { value: compare, status: fieldStatuses.deep };
};

export default compareData;
