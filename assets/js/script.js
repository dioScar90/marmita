import { getNames, setNames, toggleActiveName, removeName, } from './names_module.js'

const formMarmitas = document.querySelector('#form-marmitas')
const openPedidosModal = document.querySelector('#openPedidosModal')
const pedidosModal = document.querySelector('#pedidosModal')

const getValuesDoForm = form => {
  const formData = new FormData(form)
  const values = {}

  for (const [key, value] of formData) {
    values[key] = value.trim()
  }

  return values
}

const generateRandomHexColor = () => {
  // Generate a random hex color code (e.g., #RRGGBB)
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
  return randomColor
}

const getTextoFinal = (pedidos, total) => {
  const pedidosJoin = pedidos.join('\n\n')

  const textoFinal =
    'Bom dia! Por favor fazer as seguintes marmitas:\n\n' +
    pedidosJoin +
    '\n\nTotal de marmitas: ' +
    total +
    '.' +
    '\n\nHorário: *11h30*.' +
    '\n*TI* da *Taramps*, ao lado do Tula.' +
    '\n\nObrigado.'

  return textoFinal
}

const copyText = async e => {
  const modal = e.currentTarget.closest('#pedidosModal')
  const closeBtn = modal.querySelector('button.btn-close')
  const textarea = modal.querySelector('.modal-body textarea[hidden]')

  textarea.select()
  textarea.setSelectionRange(0, 99999)

  if ('clipboard' in navigator) {
    await navigator.clipboard.writeText(textarea.value)
    const alert = document.querySelector('#tudo-bem')
    setTimeout(() => (alert.hidden = false), 50)
  } else {
    setTimeout(() => alert('Não foi possível copiar. :( Por favor tente copiar na unha mesmo.'), 50)
  }

  formMarmitas.reset()
  closeBtn.click()
}

const insertAlertMessage = () => {
  const alert = document.querySelector('#tudo-bem')

  if (alert) {
    return
  }

  const divBotoesForm = formMarmitas.querySelector('#botoes-form')
  const alertMessage = `
    <div class="alert alert-success alert-dismissible fade show" role="alert" id="tudo-bem" hidden>
      <strong>Tudo bem, tudo bangos!</strong> Texto copiado com sucesso. <i class="fa-regular fa-face-smile-wink"></i>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
        <span aria-hidden="true"></span>
      </button>
    </div>
  `
  divBotoesForm.insertAdjacentHTML('beforebegin', alertMessage)
}

const formReset = e => {
  const alert = document.querySelector('#tudo-bem')
  alert?.toggleAttribute('hidden', true)
}

const getHeadSalada = () => `Marmita c/ 2 ovos, 2 bifes e 4 saquinhos de salada *(sem pepino)*`
const getHeadOpcao = opcao => `Opção *${opcao}*, tamanho *P*`

const getBodyComNomes = nomes => nomes.map(nome => `\n- ${nome}`).join('')

const sendTextToWhatsAppWeb = () => {
  const textoFinal = sessionStorage.getItem('textoFinal')

  if (!textoFinal) {
    return
  }

  const parsed = encodeURIComponent(textoFinal)
  location = 'https://wa.me/5518996202605/?text=' + parsed
}

const gerarPedidosObj = (values) => {
  const obj = {}

  for (const key in values) {
    const value = values[key]

    obj[value] ??= []
    obj[value].push(key)
  }

  return obj
}

const getPedidosParaTextoFinal = (pedidosObj) => {
  const pedidos = []

  for (const key in pedidosObj) {
    const value = pedidosObj[key]

    const pedidoHead = key === 'salada' ? getHeadSalada() : getHeadOpcao(key)
    const body = getBodyComNomes(value)
    const item = pedidoHead + body

    pedidos.push(item)
  }

  return pedidos
}

const formSubmit = e => {
  e.preventDefault()

  const form = e.currentTarget
  const values = getValuesDoForm(form)

  const pedidosObj = gerarPedidosObj(values)
  const pedidos = getPedidosParaTextoFinal(pedidosObj)
  
  if (pedidos.length === 0) {
    sessionStorage.removeItem('textoFinal')
    alert('Tem que escolher pelo menos 1 né fião...')
    return
  }

  const total = Object.keys(values).length
  const textoFinal = getTextoFinal(pedidos, total)

  // sendTextToWhatsAppWeb()
  // return

  const pre = document.createElement('pre')
  pre.innerText = textoFinal

  const button = document.createElement('button')
  button.type = 'dialog'
  button.setAttribute('onclick', 'copyText(this.previousElementSibling)')
  button.classList.add('btn', 'btn-warning', 'btn-sm')
  button.innerHTML = '&#x2398;'

  const textarea = document.createElement('textarea')
  textarea.value = textoFinal
  textarea.setAttribute('type', 'text')
  textarea.hidden = true
  textarea.disabled = true

  const formClose = document.createElement('form')
  formClose.method = 'dialog'

  formClose.append(textarea, button)

  pedidosModal.querySelector('.modal-body').replaceChildren(textarea, pre)
  openPedidosModal.click()

  sessionStorage.setItem('textoFinal', textoFinal)
  insertAlertMessage()
}

const getNewDiv = (value, nome) => {
  const idRadio = 'radio_' + value + '_' + nome
  return `
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="radio" name="${nome}" id="${idRadio}" value="${value}">
      <label class="form-check-label" for="${idRadio}">Opção ${value}</label>
    </div>
  `
}

const insertPlusOneOption = () => {
  const ultimasDivsValuesNumericos = document.querySelectorAll('[data-nomes] > dl > dd > div:nth-last-child(2)')

  ultimasDivsValuesNumericos.forEach(div => {
    const input = div.querySelector('input')
    const newValue = +input.value + 1
    const nome = input.name
    const newDiv = getNewDiv(newValue, nome)

    div.insertAdjacentHTML('afterend', newDiv)
  })
}

const getRadioSalada = (nome) => (`
  <div class="form-check form-check-inline">
    <input class="form-check-input" type="radio" name="${nome}" id="radio_salada_${nome}" value="salada">
    <label class="form-check-label" for="radio_salada_${nome}">Salada</label>
  </div>
`)

const getNewFormElement = (nome) => {
  const salada = getRadioSalada(nome)

  const html = `
    <dl class="row">
      <dt class="col-3">
        <label for="formGroupExampleInput_${nome}" class="fw-bold">
          ${nome}
        </label>
      </dt>

      <dd class="col-9">
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${nome}" id="radio_1_${nome}" value="1">
          <label class="form-check-label" for="radio_1_${nome}">Opção 1</label>
        </div>

        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${nome}" id="radio_2_${nome}" value="2">
          <label class="form-check-label" for="radio_2_${nome}">Opção 2</label>
        </div>

        ${salada}
      </dd>
    </dl>
  `

  return html.trim()
}

const mountFormElements = () => {
  const names = getNames()
  
  const template = document.createElement('template')
  const divNomes = formMarmitas.querySelector('[data-nomes]')
  
  for (const { name, isActive } of names) {
    if (!isActive) {
      continue
    }
    
    const newElement = getNewFormElement(name)
    template.innerHTML += newElement
  }
  
  divNomes.replaceChildren(template.content)
}

const mountFooter = () => {
  const spanCurrentYear = document.querySelector('#current_year')
  const currentYear = new Date().getFullYear()
  
  spanCurrentYear.innerText = currentYear
}

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

const getByChecks = (limit) => {
  const last = limit - 1
  let stylesheets = []
  
  for (let i = 0; i < limit; i++) {
    const value = i === last ? 'salada' : (i + 1).toString()
    const color = generateRandomHexColor()
    const sheet = `&:has(input[value="${value}"]:checked) { --color-checked-mark: ${color} }`
    stylesheets.push(sheet)
  }
  
  return stylesheets.join('\n')
}

const getStylesheetColors = () => {
  const radioBeforeContent = `\\2713`
  const stylesheets = getByChecks(10)
  
  return `
    [data-nomes] > dl {
      &:not(:last-of-type) {
          margin-bottom: 1rem;
      }
      
      &:has(input:checked) {
        & > dt > label {
          position: absolute;
          color: var(--color-checked-mark);
          
          &::before {
            content: '${radioBeforeContent}';
          }
        }
        
        & input:checked {
          --value-radio: attr(value);
        }
        
        ${stylesheets}
        
        /*
        &:has(input[value="1"]:checked) { --color-checked-mark: var(--bs-indigo) }
        &:has(input[value="2"]:checked) { --color-checked-mark: var(--bs-blue) }
        &:has(input[value="3"]:checked) { --color-checked-mark: var(--bs-yellow) }
        &:has(input[value="salada"]:checked) { --color-checked-mark: var(--bs-green) }
        */
      }
    }
  `
}

const mountCssColor = () => {
  const style = document.createElement('style')
  style.innerHTML = getStylesheetColors()
  
  document.head.append(style)
}

const init = () => {
  mountCssColor()
  mountFormElements()
  mountFooter()
  
  listenerCreator.create('click', 'button[data-copiar]', copyText)
  listenerCreator.create('click', '#plus_one_more_option', insertPlusOneOption)

  listenerCreator.create('reset', formMarmitas, formReset)

  listenerCreator.create('submit', formMarmitas, formSubmit)
}

document.addEventListener('DOMContentLoaded', init)
