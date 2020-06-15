import commander from 'commander';

const { Command } = commander;

export default () => {
  const program = new Command();
  program.version('0.1.0', '-v, --version');
  program.description('Compares two configuration files and shows a difference.');
  program.arguments('<filepath1> <filepath2>');
  program.option('-f, --format [type]', 'output format');
  program.parse(process.argv);
};
