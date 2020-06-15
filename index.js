import commander from 'commander';

const { Command } = commander;

export default () => {
  const program = new Command();
  program.version('0.0.1', '-v, --version');
  program.description('Compares two configuration files and shows a difference.');
  program.parse(process.argv);
};
