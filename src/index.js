import { compareFiles } from './comparator.js';
import cliProgram from './cli-program.js';
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

export const cli = () => {
  const program = cliProgram();
  const files = program.parse(process.argv).args;
  console.log(genDiff(...files, program.format));
};

export default genDiff;
