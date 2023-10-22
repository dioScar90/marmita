import { getNames, setNames, toggleActiveName, removeName, } from './names_module.js'
import { zeroAEsquerda, getHoraFormatada, listenerCreator, getFormValues } from './utils.js'

// const formMarmitas = document.querySelector('#form-marmitas')
// const openPedidosModal = document.querySelector('#openPedidosModal')
// const pedidosModal = document.querySelector('#pedidosModal')

const isPage = (page) => {
  const thisPage = location.pathname.split('/').at(-1)

  if (page === 'index' && thisPage === '') {
    return true
  }

  return [page, `${page}.html`].includes(thisPage)
}

const isIndexPage = () => isPage('index')
const isNamesPage = () => isPage('names')

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
  const randomColor = '#' + Math.floor(Math.random() * 16_777_215).toString(16)
  return randomColor
}

const getTextoFinal = (pedidos, total) => {
  const pedidosJoin = pedidos.join('\n\n')

  const textoFinal =
    'Bom dia! Por favor fazer as seguintes marmitas:\n\n' +
    pedidosJoin +
    '\n' +
    '\n' +
    'Total de marmitas: ' +
    total +
    '.'  +
    '\n' +
    '\n' +
    'Horário: *11h30*.' +
    '\n' +
    '*TI* da *Taramps*, ao lado do Tula.' +
    '\n' +
    '\n' +
    'Obrigado.'

  return textoFinal
}

const addNewTableRowAfterInStorage = (addedName) => {
  const template = document.createElement('template')
  const tbody = getTbodyTableNames()
  const lastTr = tbody.querySelector('tr:nth-last-child(1)')

  const idx = lastTr ? +lastTr.dataset.nameId + 1 : 0
  const newTR = getNewTableRow(addedName, idx)
  template.innerHTML = newTR

  tbody.append(template.content)
}

const addNameInStorage = (e) => {
  e.preventDefault()
  
  const form = e.target
  const button = e.submitter

  const values = getFormValues(form)

  // const button = e.currentTarget
  const modal = button.closest('#addName')
  // const form = modal.querySelector('form')
  // const nameInput = modal.querySelector('input[name="name"]')
  const closeBtn = modal.querySelector('button.btn-close')
  
  const addedName = setNames(values.name)

  if (!addedName) {
    return
  }

  addNewTableRowAfterInStorage(addedName)
  closeBtn?.click()
  form.reset()
}

const removeTextNodes = ({ childNodes }) => {
  [...childNodes].forEach(node => {
    if (!(node instanceof HTMLElement)) {
      node.remove()
    }
  })
}

const reSortTbody = ({ children }) => {
  [...children].forEach((tr, idx) => {
    tr.dataset.nameId = idx

    const allElementsWithNameId = tr.querySelectorAll('[data-name-id]')
    allElementsWithNameId.forEach(el => el.dataset.nameId = idx)

    tr.firstElementChild.innerText = zeroAEsquerda(idx + 1)
  })
}

const removeNameInStorage = (e) => {
  const button = e.currentTarget
  const modal = button.closest('#removeName')
  const closeBtn = modal.querySelector('button.btn-close')

  const removed = removeName(button.dataset.name)

  if (!removed) {
    return
  }
  
  const idx = button.dataset.nameId
  const tr = document.querySelector(`tr[data-name-id="${idx}"`)
  const tbody = tr.closest('tbody')
  
  tr?.remove()
  removeTextNodes(tbody)
  reSortTbody(tbody)
  
  closeBtn?.click()
}

const copyText = async (e) => {
  const formMarmitas = document.querySelector('#form-marmitas')
  const modal = e.currentTarget.closest('#pedidosModal')
  const closeBtn = modal.querySelector('button.btn-close')
  const textarea = modal.querySelector('.modal-body textarea[hidden]')

  textarea.select()
  textarea.setSelectionRange(0, 99999)

  if ('clipboard' in navigator) {
    await navigator.clipboard.writeText(textarea.value)
    const alert = document.querySelector('#tudo-bem')
    setTimeout(() => alert.hidden = false, 50)
  } else {
    setTimeout(() => alert('Não foi possível copiar. :( Por favor tente copiar na unha mesmo.'), 50)
  }

  formMarmitas?.reset()
  closeBtn?.click()
}

const openPedidosModal = (textarea, pre) => {
  const openPedidosModal = document.querySelector('#openPedidosModal')
  const pedidosModal = document.querySelector('#pedidosModal')

  pedidosModal.querySelector('.modal-body').replaceChildren(textarea, pre)
  openPedidosModal.click()
}

const insertAlertMessage = () => {
  const alert = document.querySelector('#tudo-bem')

  if (alert) {
    return
  }
  
  const alertMessage = `
    <div class="alert alert-success alert-dismissible fade show" role="alert" id="tudo-bem" hidden>
      <strong>Tudo bem, tudo bangos!</strong> Texto copiado com sucesso. <i class="fa-regular fa-face-smile-wink"></i>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
        <span aria-hidden="true"></span>
      </button>
    </div>
  `

  const divBotoesForm = document.querySelector('#botoes-form')
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
  openPedidosModal(textarea, pre)
  
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

const goToPage = (page) => {
  if (page === 'index') {
    
  }
  //
}

const goToNamesPage = () => {
  //
}

const onclickTableNames = (e) => {
  const button = e.target.closest('[data-remove][type=button]')
  
  if (!button) {
    return
  }

  confirmRemoveName(button.dataset)
}

const onchangeTableNames = (e) => {
  const inputRadio = e.target.closest(':scope[data-status][type=checkbox]')
  
  if (!inputRadio) {
    return
  }
  
  const isActive = inputRadio.checked
  const name = inputRadio.dataset.name

  toggleActiveName(name, isActive)
}

const getRadioSalada = (nome) => (`
  <div class="form-check form-check-inline">
    <input class="form-check-input" type="radio" name="${nome}" id="radio_salada_${nome}" value="salada">
    <label class="form-check-label" for="radio_salada_${nome}">Salada</label>
  </div>
`)

const getNewFormElement = (nome) => {
  const salada = getRadioSalada(nome)

  return `
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
}

const mountFormElements = () => {
  if (!isIndexPage()) {
    return
  }
  
  const names = getNames()
  
  const template = document.createElement('template')
  const divNomes = document.querySelector('#form-marmitas [data-nomes]')
  
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

const getTbodyTableNames = () => {
  const table = document.querySelector('#table_names')
  const tbody = table.querySelector('tbody:not(.for-empty-table)')

  if (tbody) {
    return tbody
  }

  const newTbody = document.createElement('tbody')
  table.append(newTbody)

  listenerCreator.create('click', newTbody, onclickTableNames)
  listenerCreator.create('change', newTbody, onchangeTableNames)

  return newTbody
}

const confirmRemoveName = ({ nameId, name }) => {
  const buttonOpen = document.querySelector('button[data-bs-target="#removeName"]')

  const titleSpan = document.querySelector('#removeName .modal-title span[data-name]')
  const paragSpan = document.querySelector('#removeName .modal-body span[data-name]')
  const buttonConfirm = document.querySelector('#removeName .modal-footer button[data-remove-confirm]')
  
  titleSpan.innerText = name
  paragSpan.innerText = name
  buttonConfirm.dataset.name = name
  buttonConfirm.dataset.nameId = nameId

  buttonOpen.click()
}

const getNewTableRow = ({ name, isActive }, idx) => {
  const position = zeroAEsquerda(idx + 1)

  const checked = isActive ? 'checked' : ''
  const radioId = `status_${idx}`
  
  const newTR = `
    <tr data-name-id="${idx}" data-name="${name}">
      <th scope="row">${position}</th>
      <td>${name}</td>
      <td>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="${radioId}" ${checked} data-status data-name-id="${idx}" data-name="${name}">
          <label class="form-check-label fw-bold" for="${radioId}" data-ativo="Ativo" data-inativo="Inativo"></label>
        </div>
      </td>
      <td>
        <button type="button" class="btn btn-outline-danger btn-sm m-0" data-remove data-name-id="${idx}" data-name="${name}">
          <i class="far fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `

  return newTR.trim()
}

const mountTableNames = () => {
  if (!isNamesPage()) {
    return
  }
  
  const names = getNames()
  
  const template = document.createElement('template')
  const tbody = getTbodyTableNames()
  
  for (const idx in names) {
    const newTR = getNewTableRow(names[idx], +idx)
    template.innerHTML += newTR
  }
  
  tbody.replaceChildren(template.content)
}

const getByChecks = (limit) => {
  const last = limit - 1
  const stylesheets = []
  
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
      }
    }
  `
}

const mountCssColor = () => {
  if (!isIndexPage()) {
    return
  }
  
  const style = document.createElement('style')
  style.innerHTML = getStylesheetColors()
  
  document.head.append(style)
}

const createEvents = () => {
  const events = [
    ['click',   'button[data-copiar]',                        copyText],
    // ['click',   'button[data-add-name]',                      addNameInStorage],
    ['click',   'button[data-remove-confirm]',                removeNameInStorage],
    ['click',   '#plus_one_more_option',                      insertPlusOneOption],
    ['click',   '#go_names',                                  goToNamesPage],
    ['click',   '#table_names > tbody:not(.for-empty-table)', onclickTableNames],
    ['change',  '#table_names > tbody:not(.for-empty-table)', onchangeTableNames],
    ['reset',   '#form-marmitas',                             formReset],
    ['submit',  '#form-marmitas',                             formSubmit],
    ['submit',  '#adicionar-nome',                            addNameInStorage],
  ]

  for (const [ eventType, selector, func ] of events) {
    listenerCreator.create(eventType, selector, func)
  }
}


const init = () => {
  mountCssColor()
  mountFormElements()
  mountTableNames()
  mountFooter()
  
  createEvents()
}

document.addEventListener('DOMContentLoaded', init)
