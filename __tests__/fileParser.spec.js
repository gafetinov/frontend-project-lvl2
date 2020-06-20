import parser from '../src/fileParser.js';

describe('fileParser', () => {
  test('shouldn\'t compare files with unknown formats', () => {
    const format = '.unknown-format';
    expect(() => parser('content', format)).toThrow(`Format "${format}" not supported`);
  });
});
