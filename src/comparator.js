import fs from 'fs';
import path from 'path';
import parse from './fileParser.js';

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
  const keys = [...Object.keys(a), ...Object.keys(b)];
  const compare = {};
  keys.forEach((key) => {
    compare[key] = createComparingField(a[key], b[key]);
  });
  return compare;
};

export const compareFiles = (a, b) => compareObjects(
  parse(fs.readFileSync(a, 'utf-8'), path.extname(a)),
  parse(fs.readFileSync(b, 'utf-8'), path.extname(b)),
);
