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

const getFormValues = (form) => {
  const formData = new FormData(form)
  const values = {}

  for (const [name, value] of formData) {
    values[name] = value.trim()
  }

  return values
}

const zeroAEsquerda = (str, maxLength = 2) => str.toString().padStart(maxLength, '0')

const getHoraFormatada = (data) => {
  const segundos = (data) => zeroAEsquerda(data.getSeconds())
  const minutos = (data) => zeroAEsquerda(data.getMinutes())
  const horas = (data) => zeroAEsquerda(data.getHours())

  return horas(data) + 'h' + minutos(data) + 'm' + segundos(data)
}

export { zeroAEsquerda, getHoraFormatada, listenerCreator, getFormValues }
