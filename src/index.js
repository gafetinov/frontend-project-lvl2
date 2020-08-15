import fs from 'fs';
import path from 'path';
import compare from './comparator.js';
import format from './formatters/index.js';
import parse from './parser.js';


const genDiff = (a, b, formatName) => {
  const data1 = parse(fs.readFileSync(path.resolve(a), 'utf-8'), path.extname(a));
  const data2 = parse(fs.readFileSync(path.resolve(b), 'utf-8'), path.extname(b));
  const diff = compare(data1, data2);
  return format(diff, formatName);
};

export default genDiff;
