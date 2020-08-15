import fs from 'fs';
import path from 'path';
import compare from './comparator.js';
import stylish from './formatters/stylish.js';
import plain from './formatters/plain.js';
import parse from './parser.js';
import { outputFormats } from './shared.js';


const genDiff = (a, b, format = 'json') => {
  const data1 = parse(fs.readFileSync(path.resolve(a), 'utf-8'), path.extname(a));
  const data2 = parse(fs.readFileSync(path.resolve(b), 'utf-8'), path.extname(b));
  const diff = compare(data1, data2);
  if (format === outputFormats.plain) {
    return plain(diff);
  }
  if (format === outputFormats.json) {
    return JSON.stringify(diff, null, '  ');
  }
  if (format === outputFormats.stylish) {
    return stylish(diff);
  }
  throw new Error(`Unknown format ${format}`);
};

export default genDiff;
