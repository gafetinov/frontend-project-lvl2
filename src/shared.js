export const types = {
  flat: 'flat',
  array: 'array',
  object: 'object',
};

export const getType = (a) => {
  if (Array.isArray(a)) return types.array;
  if (typeof a === 'object') return types.object;
  return types.flat;
};

export const fieldStatuses = {
  added: 'added',
  modified: 'modified',
  unmodified: 'unmodified',
  deleted: 'deleted',
  deep: 'deep',
};

export const outputFormats = {
  stylish: 'stylish',
  plain: 'plain',
  json: 'json',
};
