export default (before, after) => {
  const result = [];
  const usedKeys = [];
  Object.keys(before).forEach((key) => {
    if (Object.keys(after).indexOf(key) !== -1) {
      if (before[key] !== after[key]) {
        result.push(`- ${key}: ${before[key]}\n+ ${key}: ${after[key]}`);
      } else {
        result.push(`  ${key}: ${before[key]}`);
      }
    } else {
      result.push(`- ${key}: ${before[key]}`);
    }
    usedKeys.push(key);
  });
  Object.keys(after).forEach((key) => {
    if (!usedKeys.includes(key)) {
      result.push(`+ ${key}: ${after[key]}`);
    }
  });
  return result;
};
