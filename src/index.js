import path from 'path';
import fs from 'fs';
import commander from 'commander';
import compareObjects from './compareObjects.js';
import parse from './parsers/fileParser';

const { Command } = commander;

const initProgram = (program) => {
  program
    .version('0.1.0', '-v, --version')
    .description('Compares two configuration files and shows a difference.')
    .arguments('<filepath1> <filepath2>')
    .option('-f, --format [type]', 'output format', 'json');
};

const compareFiles = (a, b) => compareObjects(
  parse(fs.readFileSync(a), path.extname(a)),
  parse(fs.readFileSync(b), path.extname(b)),
).join('\n');

export const cli = () => {
  const program = new Command();
  initProgram(program);
  const files = program.parse(process.argv).args;
  console.log(compareFiles(...files));
};

export default compareFiles;
