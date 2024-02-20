export function datasetHtmlStringConstructor(obj) {
  const getKeyAsKebabCase = (key) => key.split(/(?=[A-Z])/).map(txt => txt.toLowerCase()).join('-')
  
  return Object.entries(obj)
    .map(([key, value]) => 'data-' + getKeyAsKebabCase(key) + '="' + value + '"')
    .join(' ')
}
