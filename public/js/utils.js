const listenerCreator = (() => {
  const isHTMLElement = selector => selector instanceof HTMLElement || selector?.nodeType === 1

  const getElementByGivenSelector = selector => {
    if (isHTMLElement(selector)) {
      return selector
    }

    return document.querySelector(selector)
  }

  const create = (eventType, selector, func, options = {}) => {
    const element = getElementByGivenSelector(selector)
    element?.addEventListener(eventType, func, { ...options })
  }

  return { create }
})()

const getStorage = (key) => JSON.parse(localStorage.getItem(key))
const setStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const clearNames = () => localStorage.removeItem('names')

const getFormValues = (form, getAllTypes = false) => {
  const formData = new FormData(form)
  const values = {}

  for (const [name, value] of formData) {
    if (getAllTypes && typeof value !== 'string') {
      continue
    }

    values[name] = value.trim()
  }

  return values
}

export { listenerCreator, getStorage, setStorage, clearNames, getFormValues }
