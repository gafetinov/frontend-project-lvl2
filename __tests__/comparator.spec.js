import genDiff from '../src/index.js';
import { compareObjects } from '../src/comparator.js';


describe('compareObjects', () => {
  const a = {
    host: 'hexlet.io',
    timeout: 50,
    proxy: '123.234.53.22',
    follow: false,
  };

  const b = {
    timeout: 20,
    verbose: true,
    host: 'hexlet.io',
  };
  test('should compare flat objects with similarities', () => {
    const compare = compareObjects(a, b);
    expect(compare.length).toBe(5);
    expect(compare).toContain('  host: hexlet.io');
    expect(compare).toContain('- timeout: 50\n+ timeout: 20');
    expect(compare).toContain('- proxy: 123.234.53.22');
    expect(compare).toContain('- follow: false');
    expect(compare).toContain('+ verbose: true');

    const compare2 = compareObjects(b, a);
    expect(compare2.length).toBe(5);
    expect(compare2).toContain('  host: hexlet.io');
    expect(compare2).toContain('- timeout: 20\n+ timeout: 50');
    expect(compare2).toContain('+ proxy: 123.234.53.22');
    expect(compare2).toContain('+ follow: false');
    expect(compare2).toContain('- verbose: true');
  });
  test('should compare absolutely compareerent flat objects', () => {
    const c = {
      timeout: 20,
      verbose: true,
      host: 'hexlet.io',
    };
    const d = {
      timeout2: 20,
      verbose2: true,
      host2: 'hexlet.io',
    };
    const compare = compareObjects(c, d);
    expect(compare.length).toBe(6);
    expect(compare).toContain('- timeout: 20');
    expect(compare).toContain('- verbose: true');
    expect(compare).toContain('- host: hexlet.io');
    expect(compare).toContain('+ timeout2: 20');
    expect(compare).toContain('+ verbose2: true');
    expect(compare).toContain('+ host2: hexlet.io');
  });
  test('should compare emptyObjects', () => {
    const compareToEmpty = compareObjects(a, {});
    expect(compareToEmpty.length).toBe(4);
    expect(compareToEmpty).toContain('- host: hexlet.io');
    expect(compareToEmpty).toContain('- timeout: 50');
    expect(compareToEmpty).toContain('- proxy: 123.234.53.22');
    expect(compareToEmpty).toContain('- follow: false');

    const compareFromEmpty = compareObjects({}, b);
    expect(compareFromEmpty.length).toBe(3);
    expect(compareFromEmpty).toContain('+ timeout: 20');
    expect(compareFromEmpty).toContain('+ verbose: true');
    expect(compareFromEmpty).toContain('+ host: hexlet.io');

    expect(compareObjects({}, {})).toEqual([]);
  });
  test('should compare identical Objects', () => {
    const compare = compareObjects(a, a);
    expect(compare.length).toBe(4);
    expect(compare).toEqual([
      '  host: hexlet.io',
      '  timeout: 50',
      '  proxy: 123.234.53.22',
      '  follow: false',
    ]);
  });
});


describe('compareFiles', () => {
  const rightCompare = [
    '  host: hexlet.io',
    '- timeout: 50',
    '+ timeout: 20',
    '- proxy: 123.234.53.22',
    '- follow: false',
    '+ verbose: true',
  ].join('\n');

  const compare = (format) => genDiff(
    `${__dirname}/fixtures/before${format}`,
    `${__dirname}/fixtures/after${format}`,
  );

  test('should compare JSON files', () => {
    expect(compare('.json')).toBe(rightCompare);
  });
  test('should compare YAML files', () => {
    expect(compare('.yaml')).toBe(rightCompare);
    expect(compare('.yml')).toBe(rightCompare);
  });
  test('should compare .ini files', () => {
    expect(compare('.ini')).toBe(rightCompare);
  });
});
