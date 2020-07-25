import fs from 'fs';
import { compareObjects, compareFiles } from '../src/comparator.js';

describe('comparator', () => {
  const genCompare = (fileNameEnd) => compareFiles(
    `${__dirname}/../__fixtures__/before${fileNameEnd}`,
    `${__dirname}/../__fixtures__/after${fileNameEnd}`,
  );

  const getExpectedCompare = (fileNameEnd) => JSON.parse(fs.readFileSync(
    `${__dirname}/../__fixtures__/compare${fileNameEnd}`,
    'utf-8',
  ));

  const testCase = (caseName) => {
    const fileNameEnd = `-${caseName}.json`;
    const actualCompare = genCompare(fileNameEnd);
    const expectedCompare = getExpectedCompare(fileNameEnd);
    expect(actualCompare).toEqual(expectedCompare);
  };

  it('should compare objects with added property', () => {
    testCase('added-property');
  });
  it('should compare objects with deleted property', () => {
    testCase('deleted-property');
  });
  it('should compare objects with modified property', () => {
    testCase('modified-property');
  });
  it('should compare equal objects', () => {
    testCase('equal-objects');
  });
  it('should compare arrays', () => {
    testCase('arrays');
  });
  it('should compare empty objects', () => {
    expect(compareObjects({}, {})).toEqual({ value: {}, status: 'deep' });
  });
});
