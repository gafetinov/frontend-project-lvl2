import fs from 'fs';
import genDiff from '../src';
import { outputFormats } from '../src/shared.js';

describe('compareFiles', () => {
  const genCompare = (fileNameEnd, outputFormat) => genDiff(
    `${__dirname}/../__fixtures__/before${fileNameEnd}`,
    `${__dirname}/../__fixtures__/after${fileNameEnd}`,
    outputFormat,
  );

  const getFixturePath = (fileName) => `${__dirname}/../__fixtures__/${fileName}`;
  const readFile = (fileName) => fs.readFileSync(getFixturePath(fileName), 'utf-8');

  it('should display with different formats', () => {
    expect(genCompare('.json')).toBe(readFile('json.txt'));
    expect(genCompare('.json', outputFormats.stylish)).toBe(readFile('stylish.txt'));
    expect(genCompare('.json', outputFormats.plain)).toBe(readFile('plain.txt'));
  });

  it('should compare files of other formats', () => {
    const expectedStr = "Property 'property' was updated. From 'old' to 'new'";
    expect(genCompare('.yml', outputFormats.plain)).toBe(expectedStr);
    expect(genCompare('.ini', outputFormats.plain)).toBe(expectedStr);
  });
});
