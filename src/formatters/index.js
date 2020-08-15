import plain from './plain.js';
import stylish from './stylish.js';

export default (data, format = 'json') => {
  if (format === 'json') {
    return JSON.stringify(data, null, '  ');
  }
  if (format === 'stylish') {
    return stylish(data);
  }
  if (format === 'plain') {
    return plain(data);
  }
  throw new Error(`Unknown output format ${format}`);
};
