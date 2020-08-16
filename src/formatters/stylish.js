import { fieldStatuses, getType, types } from '../shared.js';


const INDENT = 4;

const toStringLines = (initialValue, initialKey) => {
  const iter = (value, valueName, depth) => {
    const indent = ' '.repeat(depth * INDENT);
    const head = `${indent}${valueName}${valueName ? ': ' : ''}`;
    const type = getType(value);
    if (type === types.array) {
      const content = value.join(', ');
      return [`${head}[${content}]`];
    }
    if (type === types.object) {
      const content = Object.keys(value)
        .map((key) => iter(value[key], key, depth + 1));
      const end = `${indent}}`;
      return [`${head}{`, ...content, end];
    }
    return [`${head}${value}`];
  };
  return iter(initialValue, initialKey, 0);
};

const getMarkedField = (key, value, indent = '', sign = ' ') => {
  const lines = toStringLines(value, key);
  const firstLine = `${indent.slice(0, -2)}${sign} ${lines[0]}`;
  const nextLines = lines.slice(1).map((line) => `${indent}${line}`);
  return [firstLine, ...nextLines].join('\n');
};

const stylishFieldCompare = (fieldName, compare, indent) => {
  const { value, prev, status } = compare;
  if (status === fieldStatuses.added) {
    return getMarkedField(fieldName, value, indent, '+');
  }
  if (status === fieldStatuses.deleted) {
    return getMarkedField(fieldName, prev, indent, '-');
  }
  if (status === fieldStatuses.modified) {
    const deleted = getMarkedField(fieldName, prev, indent, '-');
    const added = getMarkedField(fieldName, value, indent, '+');
    return [deleted, added].join('\n');
  }
  return getMarkedField(fieldName, value, indent);
};

const stylish = (initialCompare) => {
  const iter = (compare, nestingLevel, fieldName) => {
    const { value, status } = compare;
    const indent = ' '.repeat(nestingLevel * INDENT);
    const head = `${indent}${fieldName}${fieldName ? ': ' : ''}`;
    if (status !== fieldStatuses.deep) {
      return stylishFieldCompare(fieldName, compare, indent);
    }
    const keys = Object.keys(value);
    const innerStylish = keys.map((key) => iter(value[key], nestingLevel + 1, key));
    const end = `${indent}}`;
    return [`${head}{`, ...innerStylish, end].join('\n');
  };
  return iter(initialCompare, 0, '');
};

export default stylish;
