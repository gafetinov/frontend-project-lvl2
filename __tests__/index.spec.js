import genDiff from '../src/index.js';

const JSONdiff = `  host: hexlet.io
- timeout: 50
+ timeout: 20
- proxy: 123.234.53.22
- follow: false
+ verbose: true`;

describe('compareFiles', () => {
  test('should compare JSON files', () => {
    const compare = genDiff(`${__dirname}/fixtures/before.json`, `${__dirname}/fixtures/after.json`);
    expect(compare).toBe(JSONdiff);
  });
});
