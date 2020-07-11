import { fieldStatuses } from './comparator.js';

const stylishFlatFieldLine = (key, field) => {
  switch (field.status) {
    case fieldStatuses.added:
      return `  + ${key}: ${field.value}`;
    case fieldStatuses.deleted:
      return `  - ${key}: ${field.prev}`;
    case fieldStatuses.modified:
      return `  - ${key}: ${field.prev}\n  + ${key}: ${field.value}`;
    case fieldStatuses.unmodified:
    default:
      return `    ${key}: ${field.value}`;
  }
};

const getObjectLines = (obj, name = '', indent = 4) => {
  if (typeof obj !== 'object') {
    return [`${' '.repeat(indent)}${name}: ${obj}`];
  }
  const lines = [`${' '.repeat(indent - 4)}${name}: {`];
  Object.keys(obj).forEach((key) => {
    lines.push(...getObjectLines(obj[key], key, indent + 4));
  });
  lines.push(`${' '.repeat(indent)}}`);
  return lines;
};

const stylish = (compare, indent = 4, head = '') => {
  if (Object.keys(compare).length === 0) {
    return '';
  }
  const lines = [`${' '.repeat(indent - 4)}${head}${head ? ': ' : ''}{`];
  Object.keys(compare).forEach((key) => {
    if (typeof compare[key].value === 'object') {
      if (compare[key].status === fieldStatuses.added) {
        lines.push(getObjectLines(compare[key].value, `  + ${key}`, indent).join('\n'));
      } else if (compare[key].status === fieldStatuses.deleted) {
        lines.push(getObjectLines(compare[key].prev, `  - ${key}`, indent).join('\n'));
      } else {
        lines.push(stylish(compare[key].value, indent + 4, key));
      }
    } else {
      lines.push(' '.repeat(indent - 4) + stylishFlatFieldLine(key, compare[key])
        .replace('\n', `\n${' '.repeat(indent - 4)}`));
    }
  });
  lines.push(`${' '.repeat(indent - 4)}}`);
  return lines.join('\n');
};

export default stylish;
