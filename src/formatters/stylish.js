import { fieldStatuses, getType, types } from '../shared.js';


const INDENT = 4;

const toStringLines = (value, valueName = '', nestingLevel = 0) => {
  const indent = ' '.repeat(nestingLevel * INDENT);
  const head = `${indent}${valueName}${valueName ? ': ' : ''}`;
  const type = getType(value);
  if (type === types.array) {
    const content = value.flatMap((el) => toStringLines(el, '', nestingLevel + 1));
    const end = `${indent}]`;
    return [`${head}[`, ...content, end];
  }
  if (type === types.object) {
    const content = Object.keys(value)
      .map((key) => toStringLines(value[key], key, nestingLevel + 1));
    const end = `${indent}}`;
    return [`${head}{`, ...content, end];
  }
  return [`${head}${value}`];
};

const getComparedFieldStr = (key, value, indent = '', sign = ' ') => {
  const lines = toStringLines(value, key);
  const firstLine = `${indent.slice(0, -2)}${sign} ${lines[0]}`;
  const nextLines = lines.slice(1).map((line) => `${indent}${line}`);
  return [firstLine, ...nextLines].join('\n');
};

const getFieldCompare = (fieldName, compare, indent) => {
  const { value, prev, status } = compare;
  if (status === fieldStatuses.added) {
    return getComparedFieldStr(fieldName, value, indent, '+');
  }
  if (status === fieldStatuses.deleted) {
    return getComparedFieldStr(fieldName, prev, indent, '-');
  }
  if (status === fieldStatuses.modified) {
    const deleted = getComparedFieldStr(fieldName, prev, indent, '-');
    const added = getComparedFieldStr(fieldName, value, indent, '+');
    return [deleted, added].join('\n');
  }
  return getComparedFieldStr(fieldName, value, indent);
};

const stylish = (compare, nestingLevel = 0, fieldName = '') => {
  const { value, status } = compare;
  const indent = ' '.repeat(nestingLevel * INDENT);
  const head = `${indent}${fieldName}${fieldName ? ': ' : ''}`;
  if (status === fieldStatuses.iterable) {
    const content = value.map((el, i) => stylish(el, nestingLevel + 1, String(i))).join('\n');
    const end = `${indent}]`;
    return [`${head}[`, content, end].join('\n');
  }
  if (status !== fieldStatuses.deep) {
    return getFieldCompare(fieldName, compare, indent);
  }
  const keys = Object.keys(value);
  const innerStylish = keys.map((key) => stylish(value[key], nestingLevel + 1, key));
  const end = `${indent}}`;
  return [`${head}{`, ...innerStylish, end].join('\n');
};

export default stylish;
