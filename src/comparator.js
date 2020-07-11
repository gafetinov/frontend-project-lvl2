import { range } from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './fileParser.js';

const types = {
  flat: 'flat',
  array: 'array',
  object: 'object',
};

const getType = (a) => {
  if (Array.isArray(a)) return types.array;
  if (typeof a === 'object') return types.object;
  return types.flat;
};

export const fieldStatuses = {
  added: 0,
  modified: 1,
  unmodified: 2,
  deleted: 3,
};

const createComparingField = (prev, current) => {
  const comparingField = { value: current, prev };
  if (prev === current) {
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

export const compareObjects = (a, b) => {
  if (typeof a !== 'object' || typeof b !== 'object') {
    return createComparingField(a, b);
  }
  const keys = [...Object.keys(a), ...Object.keys(b)];
  const compare = {};
  keys.forEach((key) => {
    const typeKeyA = getType(a[key]);
    const typeKeyB = getType(b[key]);
    if (typeKeyA !== typeKeyB || typeKeyA === types.flat) {
      compare[key] = createComparingField(a[key], b[key]);
    } else if (typeKeyA === types.array) {
      compare[key] = range(Math.max(a[key].length, b[key].length))
        .map((i) => compareObjects(a[key][i], b[key][i]));
    } else if (typeKeyA === types.object) {
      compare[key] = { value: compareObjects(a[key], b[key]) };
    }
  });
  return compare;
};

export const compareFiles = (a, b) => compareObjects(
  parse(fs.readFileSync(a, 'utf-8'), path.extname(a)),
  parse(fs.readFileSync(b, 'utf-8'), path.extname(b)),
);
