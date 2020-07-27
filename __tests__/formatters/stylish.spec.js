import fs from 'fs';
import stylish from '../../src/formatters/stylish.js';


describe('stylish', () => {
  const getCompare = (caseName) => JSON.parse(fs.readFileSync(
    `${__dirname}/../../__fixtures__/compare-${caseName}.json`,
    'utf-8',
  ));

  const getStylishString = (caseName) => fs.readFileSync(
    `${__dirname}/../../__fixtures__/stylish-${caseName}.txt`,
    'utf-8',
  );

  const testCase = (caseName) => {
    const compare = getCompare(caseName);
    const expectedString = getStylishString(caseName);
    expect(stylish(compare)).toEqual(expectedString);
  };

  it('should generate string with added property', () => {
    testCase('added-property');
  });

  it('should generate string with deleted property', () => {
    testCase('deleted-property');
  });

  it('should generate string with modified property', () => {
    testCase('modified-property');
  });

  it('should generate string of compare of equals objects', () => {
    testCase('equal-objects');
  });

  it('should generate string of compare of arrays', () => {
    testCase('arrays');
  });

  it('should generate string of added complex value', () => {
    testCase('added-complex-value');
  });

  it('should generate string of modified property with complex value', () => {
    testCase('modified-property-with-complex-value');
  });

  it('should generate string with complex value in array', () => {
    testCase('complex-value-in-array');
  });

  it('should generate string of compare of empty objects', () => {
    const compare = { value: {}, status: 'deep' };
    expect(stylish(compare)).toEqual('{\n}');
  });
});
