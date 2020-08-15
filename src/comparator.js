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

const createComparedField = (prev, current) => {
  const comparingField = { value: current, prev };
  if (isEqual(prev, current)) {
    comparingField.status = fieldStatuses.unmodified;
  } else if (prev === undefined) {
    comparingField.status = fieldStatuses.added;
  } else if (current === undefined) {
    comparingField.status = fieldStatuses.deleted;
  } else {
    comparingField.status = fieldStatuses.modified;
  }
  return comparingField;
};

const compareData = (a, b) => {
  if (isComparable(a, b)) {
    return createComparedField(a, b);
  }
  const compare = {};
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  keys.forEach((key) => {
    compare[key] = compareData(a[key], b[key]);
  });
  return { value: compare, status: fieldStatuses.deep };
};

export default compareData;
