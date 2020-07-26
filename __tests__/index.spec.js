import fs from 'fs';
import genDiff from '../src';
import { outputFormats } from '../src/shared.js';

describe('compareFiles', () => {
  const genCompare = (fileNameEnd, outputFormat) => genDiff(
    `${__dirname}/../__fixtures__/before${fileNameEnd}`,
    `${__dirname}/../__fixtures__/after${fileNameEnd}`,
    outputFormat,
  );

  describe('should compare files with different formats', () => {
    const expectedJsonString = fs.readFileSync(
      `${__dirname}/../__fixtures__/json.txt`,
      'utf-8',
    );

    test('should compare JSON files', () => {
      expect(genCompare('.json')).toBe(expectedJsonString);
    });

    test('should compare YAML files', () => {
      expect(genCompare('.yaml')).toBe(expectedJsonString);
      expect(genCompare('.yml')).toBe(expectedJsonString);
    });

    test('should compare .ini files', () => {
      expect(genCompare('.ini')).toBe(expectedJsonString);
    });
  });

  describe('should be able to return output of different formats', () => {
    test('should return stylish output', () => {
      const expected = fs.readFileSync(
        `${__dirname}/../__fixtures__/stylish.txt`,
        'utf-8',
      );
      expect(genCompare('.json', outputFormats.stylish)).toEqual(expected);
    });

    test('should return plain output', () => {
      const expected = fs.readFileSync(
        `${__dirname}/../__fixtures__/plain.txt`,
        'utf-8',
      );
      expect(genCompare('.json', outputFormats.plain)).toEqual(expected);
    });

    test('should throw an exception to an unknown output format', () => {
      expect(() => genCompare('.json', 'unknown')).toThrow('Unknown format unknown');
    });
  });
});
