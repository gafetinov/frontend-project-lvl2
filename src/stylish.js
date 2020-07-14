import { fieldStatuses, getType, types } from './shared.js';


const INDENT = 4;

const toStringLines = (value, nestingLevel = 0, valueName = '') => {
  const indent = ' '.repeat(nestingLevel * INDENT);
  const head = `${indent}${valueName}${valueName ? ': ' : ''}`;
  const type = getType(value);
  if (type === types.array) {
    const content = value.map((el) => toStringLines(el, nestingLevel + 1, ''));
    const end = `${indent}]`;
    return [`${head}[`, ...content, end];
  }
  if (type === types.object) {
    const content = Object.keys(value)
      .map((key) => toStringLines(value[key], nestingLevel + 1, key));
    const end = `${indent}}`;
    return [`${head}{`, ...content, end];
  }
  return [`${head}${value}`];
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
    const { prev } = compare;
    if (status === fieldStatuses.unmodified) {
      return toStringLines(value, 0, fieldName).map((line) => `${indent}${line}`).join('\n');
    }
    if (status === fieldStatuses.added) {
      const lines = toStringLines(value, 0, fieldName);
      const firstLine = `${indent.slice(0, -2)}+ ${lines[0]}`;
      const nextLines = lines.slice(1).map((line) => `${indent}${line}`);
      return [firstLine, ...nextLines].join('\n');
    }
    if (status === fieldStatuses.deleted) {
      const lines = toStringLines(prev, 0, fieldName);
      const firstLine = `${indent.slice(0, -2)}- ${lines[0]}`;
      const nextLines = lines.slice(1).map((line) => `${indent}${line}`);
      return [firstLine, ...nextLines].join('\n');
    }
    if (status === fieldStatuses.modified) {
      const deletedLines = toStringLines(prev, 0, fieldName);
      const deletedFirstLine = `${indent.slice(0, -2)}- ${deletedLines[0]}`;
      const deleted = [deletedFirstLine, ...deletedLines.slice(1).map((line) => `${indent}${line}`)].join('\n');
      const addedLines = toStringLines(value, 0, fieldName);
      const addedFirstLine = `${indent.slice(0, -2)}+ ${addedLines[0]}`;
      const added = [addedFirstLine, ...addedLines.slice(1).map((line) => `${indent}${line}`)].join('\n');
      return [deleted, added].join('\n');
    }
  }
  const keys = Object.keys(value);
  const innerStylish = keys.map((key) => stylish(value[key], nestingLevel + 1, key));
  const end = `${indent}}`;
  return [`${head}{`, ...innerStylish, end].join('\n');
};

export default stylish;
