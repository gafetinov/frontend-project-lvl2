import commander from 'commander';
import fs from 'fs';

const { Command } = commander;

const initProgram = (program) => {
  program
    .version('0.1.0', '-v, --version')
    .description('Compares two configuration files and shows a difference.')
    .arguments('<filepath1> <filepath2>')
    .option('-f, --format [type]', 'output format', 'json');
};

const compareJson = (a, b) => {
  const result = [];
  const usedKeys = [];
  Object.keys(a).forEach((key) => {
    if (Object.keys(b).indexOf(key) !== -1) {
      if (a[key] !== b[key]) {
        result.push(`+ ${key}: ${b[key]}`);
        result.push(`- ${key}: ${a[key]}`);
      } else {
        result.push(`  ${key}: ${a[key]}`);
      }
    } else {
      result.push(`- ${key}: ${a[key]}`);
    }
    usedKeys.push(key);
  });
  Object.keys(b).forEach((key) => {
    if (!usedKeys.includes(key)) {
      result.push(`+ ${key}: ${b[key]}`);
    }
  });
  return result.join('\n');
};

const compareFiles = (path1, path2) => compareJson(
  JSON.parse(fs.readFileSync(path1, 'utf-8')),
  JSON.parse(fs.readFileSync(path2, 'utf-8')),
);

export const cli = () => {
  const program = new Command();
  initProgram(program);
  const files = program.parse(process.argv).args;
  console.log(compareFiles(...files));
};

export default compareJson;
