import fs from 'fs';
import path from 'path';
import parse from './fileParser.js';

export const compareObjects = (a, b) => {
  const result = [];
  const usedKeys = [];
  Object.keys(a).forEach((key) => {
    if (Object.keys(b).indexOf(key) !== -1) {
      if (a[key] !== b[key]) {
        result.push(`- ${key}: ${a[key]}\n+ ${key}: ${b[key]}`);
      } else {
        result.push(`  ${key}: ${a[key]}`);
      }
    } else {
      result.push(`- ${key}: ${a[key]}`);
    }
    usedKeys.push(key);
  });
  Object.keys(b).forEach((key) => {
    if (!usedKeys.includes(key)) {
      result.push(`+ ${key}: ${b[key]}`);
    }
  });
  return result;
};

export const compareFiles = (a, b) => compareObjects(
  parse(fs.readFileSync(a, 'utf-8'), path.extname(a)),
  parse(fs.readFileSync(b, 'utf-8'), path.extname(b)),
);
