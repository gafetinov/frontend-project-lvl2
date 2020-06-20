import { compareFiles } from './comparator.js';
import cliProgram from './cli-program.js';


export const cli = () => {
  const program = cliProgram();
  const files = program.parse(process.argv).args;
  console.log(compareFiles(...files));
};

export default (a, b) => compareFiles(a, b).join('\n');
