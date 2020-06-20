import { compareObjects } from '../src/comparator.js';


const before = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};

const after = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
};

describe('compareObjects', () => {
  test('should compare flat objects with similarities', () => {
    const compare = compareObjects(before, after);
    expect(compare.length).toBe(5);
    expect(compare).toContain('  host: hexlet.io');
    expect(compare).toContain('- timeout: 50\n+ timeout: 20');
    expect(compare).toContain('- proxy: 123.234.53.22');
    expect(compare).toContain('- follow: false');
    expect(compare).toContain('+ verbose: true');

    const compare2 = compareObjects(after, before);
    expect(compare2.length).toBe(5);
    expect(compare2).toContain('  host: hexlet.io');
    expect(compare2).toContain('- timeout: 20\n+ timeout: 50');
    expect(compare2).toContain('+ proxy: 123.234.53.22');
    expect(compare2).toContain('+ follow: false');
    expect(compare2).toContain('- verbose: true');
  });
  test('should compare absolutely compareerent flat objects', () => {
    const a = {
      timeout: 20,
      verbose: true,
      host: 'hexlet.io',
    };
    const b = {
      timeout2: 20,
      verbose2: true,
      host2: 'hexlet.io',
    };
    const compare = compareObjects(a, b);
    expect(compare.length).toBe(6);
    expect(compare).toContain('- timeout: 20');
    expect(compare).toContain('- verbose: true');
    expect(compare).toContain('- host: hexlet.io');
    expect(compare).toContain('+ timeout2: 20');
    expect(compare).toContain('+ verbose2: true');
    expect(compare).toContain('+ host2: hexlet.io');
  });
  test('should compare emptyObjects', () => {
    const compareToEmpty = compareObjects(before, {});
    expect(compareToEmpty.length).toBe(4);
    expect(compareToEmpty).toContain('- host: hexlet.io');
    expect(compareToEmpty).toContain('- timeout: 50');
    expect(compareToEmpty).toContain('- proxy: 123.234.53.22');
    expect(compareToEmpty).toContain('- follow: false');

    const compareFromEmpty = compareObjects({}, after);
    expect(compareFromEmpty.length).toBe(3);
    expect(compareFromEmpty).toContain('+ timeout: 20');
    expect(compareFromEmpty).toContain('+ verbose: true');
    expect(compareFromEmpty).toContain('+ host: hexlet.io');

    expect(compareObjects({}, {})).toEqual([]);
  });
  test('should compare identical Objects', () => {
    const compare = compareObjects(before, before);
    expect(compare.length).toBe(4);
    expect(compare).toEqual([
      '  host: hexlet.io',
      '  timeout: 50',
      '  proxy: 123.234.53.22',
      '  follow: false',
    ]);
  });
});
