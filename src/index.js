import { compareFiles } from './comparator.js';
import cliProgram from './cli-program.js';


const genDiff = (a, b) => compareFiles(a, b).join('\n');

export const cli = () => {
  const program = cliProgram();
  const files = program.parse(process.argv).args;
  console.log(genDiff(...files));
};

export default genDiff;
