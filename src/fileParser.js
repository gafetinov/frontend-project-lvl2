import { safeLoad as parseYaml } from 'js-yaml';
import { parse as parseIni } from 'ini';

export default (fileContent, format) => {
  switch (format) {
    case '.json':
      return JSON.parse(fileContent);
    case '.yaml':
    case '.yml':
      return parseYaml(fileContent);
    case '.ini':
      return parseIni(fileContent);
    default:
      throw new Error(`Format "${format}" not supported`);
  }
};
