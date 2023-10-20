const listenerCreator = (() => {
  let isHTMLElement

  const setIsHTMLElement = selector =>
    (isHTMLElement = selector instanceof HTMLElement || selector?.nodeType === 1)

  const getElementByGivenSelector = selector => {
    setIsHTMLElement(selector)

    if (isHTMLElement) {
      return selector
    }

    return document.querySelector(selector)
  }

  const create = (eventType, selector, func, callAndRemoveEvent = false) => {
    const element = getElementByGivenSelector(selector)
    const options = { once: callAndRemoveEvent }
    element?.addEventListener(eventType, func, options)
  }

  return { create }
})()

const zeroAEsquerda = (str, maxLength = 2) => str.toString().padStart(maxLength, '0')

const getHoraFormatada = (data) => {
  const segundos = (data) => zeroAEsquerda(data.getSeconds())
  const minutos = (data) => zeroAEsquerda(data.getMinutes())
  const horas = (data) => zeroAEsquerda(data.getHours())

  return horas(data) + 'h' + minutos(data) + 'm' + segundos(data)
}

export { zeroAEsquerda, getHoraFormatada, listenerCreator }
