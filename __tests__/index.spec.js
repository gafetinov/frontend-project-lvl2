import genDiff from '../src/index.js';

const rightCompare = `  host: hexlet.io
- timeout: 50
+ timeout: 20
- proxy: 123.234.53.22
- follow: false
+ verbose: true`;

describe('compareFiles', () => {
  test('should compare JSON files', () => {
    const compare = genDiff(`${__dirname}/fixtures/before.json`, `${__dirname}/fixtures/after.json`);
    expect(compare).toBe(rightCompare);
  });
  test('should compare YAML files', () => {
    const compare = genDiff(`${__dirname}/fixtures/before.yaml`, `${__dirname}/fixtures/after.yaml`);
    expect(compare).toBe(rightCompare);
  });
});
