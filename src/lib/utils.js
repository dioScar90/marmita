export function datasetHtmlStringConstructor(obj) {
  const getSplitedKey = (key) => key.split(/(?=[A-Z])/).map(txt => txt.toLowerCase()).join('-')
  
  return Object.entries(obj)
    .map(([key, value]) => 'data-' + getSplitedKey(key) + '="' + value + '"')
    .join(' ')
}
