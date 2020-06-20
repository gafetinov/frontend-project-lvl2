import yaml from 'js-yaml';
import ini from 'ini';

export default (fileContent, format) => {
  switch (format) {
    case '.json':
      return JSON.parse(fileContent);
    case '.yaml':
    case '.yml':
      return yaml.safeLoad(fileContent);
    case '.ini':
      return ini.parse(fileContent);
    default:
      throw new Error(`Format "${format}" not supported`);
  }
};
