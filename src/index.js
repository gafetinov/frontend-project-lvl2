import fs from 'fs';
import path from 'path';
import compare from './comparator.js';
import format from './formatters/index.js';
import parse from './parser.js';

const readFile = (filepath) => {
  const fullPath = path.resolve(filepath);
  return fs.readFileSync(fullPath, 'utf-8');
};

const genDiff = (a, b, formatName = 'stylish') => {
  const data1 = parse(readFile(a), path.extname(a));
  const data2 = parse(readFile(b), path.extname(b));
  const diff = compare(data1, data2);
  return format(diff, formatName);
};

export default genDiff;
