import commander from 'commander';
import genDiff from './index.js';


export default () => {
  commander.program
    .version('1.0.0', '-v, --version')
    .description('Compares two configuration files and shows a difference.')
    .arguments('<filepath1> <filepath2>')
    .option('-f, --format [type]', 'output format', 'stylish')
    .action((filepath1, filepath2, options) => {
      console.log(genDiff(filepath1, filepath2, options.format));
    })
    .parse(process.argv);
};
