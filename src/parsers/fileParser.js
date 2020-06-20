import yaml from 'js-yaml';

export default (fileContent, format) => {
  switch (format) {
    case '.json':
      return JSON.parse(fileContent);
    case '.yaml':
      return yaml.safeLoad(fileContent);
    default:
      throw new Error(`Format "${format}" not supported`);
  }
};