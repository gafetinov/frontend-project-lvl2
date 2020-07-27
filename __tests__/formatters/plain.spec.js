import fs from 'fs';
import plain from '../../src/formatters/plain.js';


describe('plain', () => {
  const getCompare = (fileNameEnd) => JSON.parse(fs.readFileSync(
    `${__dirname}/../../__fixtures__/compare${fileNameEnd}`,
    'utf-8',
  ));

  it('should generate string of added property', () => {
    const compare = getCompare('-added-property.json');
    const expectedOutput = "Property 'obj.setting2' was added with value: 'new'";
    expect(plain(compare)).toEqual(expectedOutput);
  });
  it('should generate string of deleted property', () => {
    const compare = getCompare('-deleted-property.json');
    const expectedOutput = "Property 'obj.setting2' was removed";
    expect(plain(compare)).toEqual(expectedOutput);
  });
  it('should generate string of modified property', () => {
    const compare = getCompare('-modified-property.json');
    const expectedOutput = "Property 'obj.setting1' was updated. From true to 'changed'";
    expect(plain(compare)).toEqual(expectedOutput);
  });
  it('should generate string of compare of equal objects', () => {
    const compare = getCompare('-equal-objects.json');
    expect(plain(compare)).toEqual('');
  });
  it('should generate string of compare of arrays', () => {
    const compare = getCompare('-arrays.json');
    const expectedOutput = [
      "Property 'obj.arr[1]' was updated. From true to false",
      "Property 'obj.arr[2]' was added with value: 'added'",
    ].join('\n');
    expect(plain(compare)).toEqual(expectedOutput);
  });
  it('should generate string of compare of empty objects', () => {
    const compare = { value: {}, status: 'deep' };
    expect(plain(compare)).toEqual('');
  });
  it('should generate string of added complex value', () => {
    const compare = getCompare('-added-complex-value.json');
    const expectedOutput = [
      "Property 'property.obj' was added with value: [complex value]",
      "Property 'property.arr' was added with value: [complex value]",
    ].join('\n');
    expect(plain(compare)).toEqual(expectedOutput);
  });
  it('should generate string of modified property with complex value', () => {
    const compare = getCompare('-modified-property-with-complex-value.json');
    const expectedOutput = [
      "Property 'property.obj' was updated. From [complex value] to 'flat'",
      "Property 'property.arr' was updated. From 'flat' to [complex value]",
    ].join('\n');
    expect(plain(compare)).toEqual(expectedOutput);
  });
});
