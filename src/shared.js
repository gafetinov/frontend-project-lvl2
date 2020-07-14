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
  added: 0,
  modified: 1,
  unmodified: 2,
  deleted: 3,
  iterable: 4,
  deep: 5,
};
