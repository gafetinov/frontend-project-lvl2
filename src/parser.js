import yaml from 'js-yaml';
import ini from 'ini';

export default (str, format) => {
  switch (format) {
    case '.json':
      return JSON.parse(str);
    case '.yaml':
    case '.yml':
      return yaml.safeLoad(str);
    case '.ini':
      return ini.parse(str);
    default:
      throw new Error(`Format "${format}" not supported`);
  }
};
