import _ from 'lodash';
import { fieldStatuses } from './shared.js';

const areComparable = (a, b) => !(_.isObject(a) && _.isObject(b)) || _.isArray(a) || _.isArray(b);

const compareData = (a, b) => {
  const compare = { value: b, prev: a };
  if (a === undefined) {
    compare.status = fieldStatuses.added;
    return compare;
  }
  if (b === undefined) {
    compare.status = fieldStatuses.deleted;
    return compare;
  }
  if (areComparable(a, b)) {
    compare.status = _.isEqual(a, b) ? fieldStatuses.unmodified : fieldStatuses.modified;
    return compare;
  }
  const keys = Object.keys({ ...a, ...b });
  const valuesCompare = keys.map((key) => compareData(a[key], b[key]));
  const deepCompare = _.zipObject(keys, valuesCompare);
  return { value: deepCompare, status: fieldStatuses.deep };
};

export default compareData;
