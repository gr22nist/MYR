export const reorderSections = (sections, startIndex, endIndex) => {
  const result = Array.from(sections);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
