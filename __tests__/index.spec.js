import fs from 'fs';
import genDiff from '../src';
import { outputFormats } from '../src/shared.js';

describe('compareFiles', () => {
  const genCompare = (fileNameEnd, outputFormat) => genDiff(
    `${__dirname}/../__fixtures__/before${fileNameEnd}`,
    `${__dirname}/../__fixtures__/after${fileNameEnd}`,
    outputFormat,
  );

  it('should display with different formats', () => {
    const getExpectedString = (format = 'json') => fs.readFileSync(
      `${__dirname}/../__fixtures__/${format}.txt`,
      'utf-8',
    );
    expect(genCompare('.json')).toBe(getExpectedString());
    expect(genCompare('.json', outputFormats.stylish)).toBe(getExpectedString(outputFormats.stylish));
    expect(genCompare('.json', outputFormats.plain)).toBe(getExpectedString(outputFormats.plain));
  });

  it('should compare files of other formats', () => {
    const expectedStr = "Property 'property' was updated. From 'old' to 'new'";
    expect(genCompare('.yml', outputFormats.plain)).toBe(expectedStr);
    expect(genCompare('.ini', outputFormats.plain)).toBe(expectedStr);
  });
});
