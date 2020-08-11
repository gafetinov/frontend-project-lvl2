import yaml from 'js-yaml';
import ini from 'ini';

export default (string, format) => {
  switch (format) {
    case '.json':
      return JSON.parse(string);
    case '.yaml':
    case '.yml':
      return yaml.safeLoad(string);
    case '.ini':
      return ini.parse(string);
    default:
      throw new Error(`Format "${format}" not supported`);
  }
};
