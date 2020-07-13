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
  iterable: 4,
  deep: 5,
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
  const compare = {};
  const [typeA, typeB] = [getType(a), getType(b)];
  if (typeA === types.array && typeB === types.array) {
    return {
      value: range(Math.max(a.length, b.length)).map((i) => compareObjects(a[i], b[i])),
      status: fieldStatuses.iterable,
    };
  }
  if (typeA !== types.object || typeB !== types.object) {
    return createComparingField(a, b);
  }
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  keys.forEach((key) => {
    compare[key] = compareObjects(a[key], b[key]);
  });
  return { value: compare, status: fieldStatuses.deep };
};

export const compareFiles = (a, b) => compareObjects(
  parse(fs.readFileSync(a, 'utf-8'), path.extname(a)),
  parse(fs.readFileSync(b, 'utf-8'), path.extname(b)),
);
