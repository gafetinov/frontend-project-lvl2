import commander from 'commander';
import genDiff from './index.js';


const init = () => new commander.Command()
  .version('0.1.0', '-v, --version')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format', 'json');

export default () => {
  const program = init();
  const filePaths = program.parse(process.argv).args;
  console.log(genDiff(...filePaths, program.format));
};
