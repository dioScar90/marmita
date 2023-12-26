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

const cssColors = (() => {
  const generateRandomHexColor = () => {
    // Generate a random hex color code (e.g., #RRGGBB)
    const randomColor = '#' + Math.floor(Math.random() * 16_777_215).toString(16)
    return randomColor
  }

  const getByChecks = (maxTypes, tamanhos) => {
    const stylesheets = []
  
    for (let i = 1; i <= maxTypes; i++) {
      const sheets = tamanhos.map((tam) => {
        const value = i + tam
        const color = generateRandomHexColor()
        const sheet = `&:has(input[value="${value}"]:checked) { --color-checked-mark: ${color} }`
  
        return sheet
      })
      
      stylesheets.push(...sheets)
    }
  
    return stylesheets.join('\n')
  }
  
  const formatarNumero = (e) => {
    const input = e.currentTarget
    const valorDigitado = input.value
  
    // Remove todos os caracteres não numéricos do input
    const numeroLimpo = valorDigitado.replace(/\D/g, '')
  
    if (numeroLimpo === '') {
      input.classList.remove('typing', 'matched')
      input.value = numeroLimpo
      return
    }
  
    // Aplica o padrão de formatação aos dígitos
    const numeroFormatado = numeroLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  
    // Atualiza o valor do input com o número formatado
    input.value = numeroFormatado
  
    input.classList.add('typing')
    input.classList.toggle('matched', input.checkValidity())
  }
  
  const getStylesheetColors = (maxTypes, tamanhos) => {
    const radioBeforeContent = `\\2713`
    const whiteSpace = `\\0000a0`
    const stylesheets = getByChecks(maxTypes, tamanhos)
  
    return `
      [data-nomes] > dl {
        &:not(:last-of-type) {
            margin-bottom: 1rem;
        }
        
        &:has(input:checked) {
          & > dt {
            position: relative;
            
            > .name-to-order {
              position: absolute;
              color: var(--color-checked-mark);
              
              &::before {
                content: '${radioBeforeContent}' '${whiteSpace}';
              }
            }
          }
          
          & input:checked {
            --value-radio: attr(value);
          }
          
          ${stylesheets}
        }
      }
    `
  }
  
  const mount = (maxTypes, tamanhos) => {
    const style = document.createElement('style')
    style.innerHTML = getStylesheetColors(maxTypes, tamanhos)
  
    document.head.append(style)
  }

  return { mount }
})()

const getStorage = (key) => JSON.parse(localStorage.getItem(key))
const setStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value))

const clearPhones = () => localStorage.removeItem('phones')
const clearNames = () => localStorage.removeItem('names')

const getFormValues = (form, intoArray = false, getAllTypes = false) => {
  const formData = new FormData(form)
  const values = intoArray === true ? [] : {}

  for (const [name, value] of formData) {
    if (getAllTypes && typeof value !== 'string') {
      continue
    }

    if (intoArray === true) {
      values.push({name, value})
    } else {
      values[name] = value
    }
  }

  return values
}

export { listenerCreator, cssColors, getStorage, setStorage, clearNames, clearPhones, getFormValues }
