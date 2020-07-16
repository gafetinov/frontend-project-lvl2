import { compareFiles } from './comparator.js';
import cliProgram from './cli-program.js';
import stylish from './formatters/stylish.js';
import { outputFormats } from './shared.js';
import plain from './formatters/plain.js';


const genDiff = (a, b, format) => {
  const diff = compareFiles(a, b);
  if (format === outputFormats.plain) {
    return plain(diff);
  }
  return stylish(diff);
};

export const cli = () => {
  const program = cliProgram();
  const files = program.parse(process.argv).args;
  console.log(genDiff(...files, program.format));
};

export default genDiff;
