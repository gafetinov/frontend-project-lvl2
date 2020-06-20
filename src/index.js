import fs from 'fs';
import commander from 'commander';
import compareObjects from './compareObjects.js';

const { Command } = commander;

const initProgram = (program) => {
  program
    .version('0.1.0', '-v, --version')
    .description('Compares two configuration files and shows a difference.')
    .arguments('<filepath1> <filepath2>')
    .option('-f, --format [type]', 'output format', 'json');
};

const compareFiles = (path1, path2) => compareObjects(
  JSON.parse(fs.readFileSync(path1, 'utf-8')),
  JSON.parse(fs.readFileSync(path2, 'utf-8')),
).join('\n');

export const cli = () => {
  const program = new Command();
  initProgram(program);
  const files = program.parse(process.argv).args;
  console.log(compareFiles(...files));
};

export default compareFiles;
