import { compareFiles } from './comparator.js';
import cliProgram from './cli-program.js';
import stylish from './formatters/stylish.js';


const genDiff = (a, b) => stylish(compareFiles(a, b));

export const cli = () => {
  const program = cliProgram();
  const files = program.parse(process.argv).args;
  console.log(genDiff(...files));
};

export default genDiff;
