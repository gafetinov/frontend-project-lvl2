import { compareFiles } from './comparator.js';
import stylish from './formatters/stylish.js';
import { outputFormats } from './shared.js';
import plain from './formatters/plain.js';


const genDiff = (a, b, format = 'json') => {
  const diff = compareFiles(a, b);
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
