import commander from 'commander';


export default () => new commander.Command()
  .version('0.1.0', '-v, --version')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format', 'json');
