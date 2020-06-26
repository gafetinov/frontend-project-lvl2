import { fieldStatuses } from './comparator.js';

const stylish = (compare) => {
  if (Object.keys(compare).length === 0) {
    return '';
  }
  const lines = ['{'];
  Object.keys(compare).forEach((key) => {
    const field = compare[key];
    switch (field.status) {
      case fieldStatuses.added:
        lines.push(`  + ${key}: ${field.value}`);
        break;
      case fieldStatuses.deleted:
        lines.push(`  - ${key}: ${field.prev}`);
        break;
      case fieldStatuses.unmodified:
        lines.push(`    ${key}: ${field.value}`);
        break;
      case fieldStatuses.modified:
        lines.push(`  - ${key}: ${field.prev}`);
        lines.push(`  + ${key}: ${field.value}`);
        break;
      default:
        throw Error('Wrong field status!');
    }
  });
  lines.push('}');
  return lines.join('\n');
};

export default stylish;
