import commander from 'commander';

const { Command } = commander;

const initProgram = (program) => {
  program.version('0.1.0', '-v, --version');
  program.description('Compares two configuration files and shows a difference.');
  program.arguments('<filepath1> <filepath2>');
  program.option('-f, --format [type]', 'output format');
};

export default () => {
  const program = new Command();
  initProgram(program);
  program.parse(process.argv);
};
