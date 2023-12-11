import { getNames, setNewName, toggleActiveName, removeName, sortNames, changeNamePosition } from './names.js'
import { zeroAEsquerda, listenerCreator, getFormValues, getLocalStorage, setLocalStorage, clearLocalStorageNames } from './utils.js'
import { startingDrag, endingDrag, movingDragElement } from './drag_drop.js'
// import CustomEncryption from './encryption.js'

const MAX_TYPES = 5

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

  const idx = lastTr ? (lastTr.sectionRowIndex + 1) : 0
  const newTrHtml = getNewTableRow(addedName, idx, true)
  template.innerHTML = newTrHtml

  tbody.append(template.content)
  const newTr = tbody.lastElementChild

  newTr.addEventListener('animationend', () => newTr.classList.remove('blink'))
}

const addNameInStorage = (e) => {
  e.preventDefault()

  const form = e.target
  const button = e.submitter

  const values = getFormValues(form)
  
  const modal = button.closest('#addName')
  const closeBtn = modal.querySelector('button.btn-close')
  
  const addedName = setNewName(values.name)

  if (!addedName) {
    return
  }

  addNewTableRowAfterInStorage(addedName)
  closeBtn?.click()
  form.reset()
}

const focusInputText = (e) => {
  const modal = e.currentTarget
  const input = modal.querySelector('input[name="name"]')
  
  if (e.target !== modal || !modal.classList.contains('show')) {
    return
  }
  
  setTimeout(() => input.focus(), 500)
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
    
    tr.firstElementChild.innerText = zeroAEsquerda(idx + 1)
  })
}

const removeTr = async (tr, names) => {
  tr.classList.add('to-remove')
  tr.addEventListener('transitionend', () => {
    tr.remove()
    mountTableNames(names)
  })
}

const removeNameInStorage = (e) => {
  try {
    const button = e.currentTarget
    const modal = button.closest('#removeName')
    const closeBtn = modal.querySelector('button.btn-close')
  
    const id = button.dataset?.nameId
    const names = removeName(id)
  
    if (!names) {
      return
    }
    
    const tr = document.querySelector(`tr[data-name-id="${id}"`)
    removeTr(tr, names)
    
    closeBtn?.click()
  } catch (err) {
    alert(err.toString())
  }
}

const removeAllNames = (e) => {
  const button = e.currentTarget
  const modal = button.closest('#removeAllNames')
  const closeBtn = modal.querySelector('button.btn-close')

  const tbody = document.querySelector('#table_names > tbody:last-child')
  tbody.replaceChildren()

  clearLocalStorageNames()

  closeBtn.click()
}

const modifySortButtonAttribute = () => {
  const button = document.querySelector('[data-sort-names]')

  if (!button) {
    return
  }

  const asc = getLocalStorage('sort')
  button.dataset.sortNames = asc ? 'up' : 'down'
}

const sortNamesInTable = () => {
  const names = sortNames()

  if (!names) {
    return
  }

  modifySortButtonAttribute()
  mountTableNames(names)
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

const insertPlusOneOption = () => {
  const selector = `[data-nomes] > dl > dd:not(:has(:nth-child(${MAX_TYPES}))) > div:nth-last-child(2)`
  const ultimasDivsValuesNumericos = document.querySelectorAll(selector)
  
  if (ultimasDivsValuesNumericos.length === 0) {
    alert('Máximo de opção já atingidas')
    return
  }

  ultimasDivsValuesNumericos.forEach(div => {
    const input = div.querySelector('input')
    const newValue = +input.value + 1
    const nome = input.name
    const newDiv = getNewDivOption(newValue, nome)

    div.insertAdjacentHTML('afterend', newDiv)
  })
}

const onclickTableNames = (e) => {
  const button = e.target.closest('button:is([data-remove], [data-order])')
  
  if (!button) {
    return
  }

  const tr = button.closest('tr')

  if ('remove' in button.dataset) {
    confirmRemoveName(tr.dataset)
    return
  }

  if ('order' in button.dataset) {
    prepareChangeName(tr, button.dataset.order)
    return
  }
}

const onchangeTableNames = (e) => {
  const inputRadio = e.target.closest(':scope[data-status][type=checkbox]')
  
  if (!inputRadio) {
    return
  }
  
  const isActive = inputRadio.checked
  const id = inputRadio.closest('tr').dataset.nameId

  toggleActiveName(id, isActive)
}

const getNewDivOption = (value, nome) => {
  const idRadio = 'radio_' + value + '_' + nome

  const dataEn = isNaN(value) ? 'Salad only' : 'Option ' + value
  const dataPtBr = isNaN(value) ? 'Só salada' : 'Opção ' + value

  return `
    <div class="form-check form-check-inline option-div">
      <input class="form-check-input" type="radio" name="${nome}" id="${idRadio}" value="${value}">
      <label class="form-check-label" for="${idRadio}" data-nomes data-content data-en="${dataEn}" data-pt-br="${dataPtBr}"></label>
    </div>
  `
}

const getOptionSalad = (nome) => getNewDivOption('salada', nome)

const getNewFormElement = (nome) => {
  const option1 = getNewDivOption(1, nome)
  const option2 = getNewDivOption(2, nome)
  const salada = getOptionSalad(nome)

  return `
    <dl class="row justify-content-center">
      <dt class="col-4 col-md-2">
        <label>${nome}</label>
      </dt>
      
      <dd class="col-8 col-md-auto">
        ${option1}
        ${option2}
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

  if (names.length === 0) {
    return
  }
  
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

  if (!divNomes.childElementCount) {
    return
  }

  const allBtnDisabled = document.querySelectorAll('button[disabled]')
  allBtnDisabled.forEach(btn => btn.disabled = false)
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

const changePositionTableRows = (tr, asc) => {
  const otherTr = asc === true ? tr.previousElementSibling : tr.nextElementSibling

  if (asc === true) {
    otherTr.before(tr)
    return
  }

  otherTr.after(tr)
}

const prepareChangeName = (tr, order) => {
  const asc = order === 'up'
  changePositionTableRows(tr, asc)
  
  const names = changeNamePosition(tr.dataset.nameId, tr.sectionRowIndex)
  
  if (!names) {
    return
  }

  mountTableNames(names)
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

const getNewTableRow = ({ id, name, isActive }, idx, blink = false) => {
  const checked = isActive ? 'checked' : ''
  const radioId = `status_${idx}`

  const blinkClass = blink ? 'class="blink"' : ''
  
  const newTR = `
    <tr ${blinkClass} data-name-id="${id}" data-name="${name}" draggable="true">
      <th scope="row"></th>
      <td>
        ${name}
      </td>
      <td class="col col-md-3">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="${radioId}" ${checked} data-status>
          <label class="form-check-label fw-bold" for="${radioId}" data-ativo="Ativo" data-inativo="Inativo"></label>
        </div>
      </td>
      <td class="col col-md-2">
        <div class="row">
          <div class="col px-1">
            <button type="button" class="btn btn-outline-danger btn-sm m-0" data-remove>
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
          <div class="col px-1">
            <button type="button" class="btn btn-outline-warning btn-sm m-0" data-order="down">
              <i class="fa-solid fa-caret-down"></i>
            </button>
          </div>
          <div class="col px-1">
            <button type="button" class="btn btn-outline-success btn-sm m-0" data-order="up">
              <i class="fa-solid fa-caret-up"></i>
            </button>
          </div>
        </div>
      </td>
    </tr>
  `

  return newTR.trim()
}

const updateTableRow = (tr, i, { id, name, isActive }) => {
  const checkbox = tr.querySelector('input[type=checkbox]')
  
  tr.dataset.nameId = id
  checkbox.checked = isActive

  tr.children[1].innerText = name
}

const mountTableNames = (namesArg = null, blink = false) => {
  if (!isNamesPage()) {
    return
  }
  
  const names = namesArg ?? getNames()
  
  const template = document.createElement('template')
  const tbody = getTbodyTableNames()
  
  for (const idx in names) {
    const i = +idx
    const tr = tbody.querySelector(`tr:nth-child(${(i + 1)})`)
    
    if (!tr) {
      const newTR = getNewTableRow(names[i], i, blink)
      template.innerHTML += newTR
      continue
    }

    updateTableRow(tr, i, names[i])
  }

  if (!template.content.childElementCount) {
    return
  }
  
  tbody.append(template.content)
}

const endingDragController = (e) => {
  const names = endingDrag(e)
  
  if (!names) {
    return
  }

  mountTableNames(names)
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
  const whiteSpace = `\\0000a0`
  const stylesheets = getByChecks(MAX_TYPES)
  
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
            content: '${radioBeforeContent}' '${whiteSpace}';
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

const getLang = (defaultLang) => {
  if (!('lang' in localStorage)) {
    setLocalStorage('lang', defaultLang)
  }

  return getLocalStorage('lang')
}

const changeLang = (e) => {
  const inputSwitch = e.target
  
  setLocalStorage('lang', inputSwitch.value)
  defineLangHtml(inputSwitch.value)
}

const defineLangHtml = (lang = null) => {
  const html = document.querySelector('html')
  const langValue = lang ?? getLang(html.lang)
  const input = document.querySelector(`#switch_lang input[value="${langValue}"]`)
  
  html.lang = langValue
  input.checked = true
}

const routerCheck = () => {
  const acceptedPages = ['index', 'names'/*, 'phones'*/]
  return acceptedPages.some(page => isPage(page))
}

const createEvents = () => {
  const events = [
    ['click',         'button[data-copiar]',                        copyText],
    ['click',         'button[data-remove-confirm]',                removeNameInStorage],
    ['click',         'button[data-remove-all-confirm]',            removeAllNames],
    ['click',         'button[data-sort-names]',                    sortNamesInTable],
    ['click',         '#plus_one_more_option',                      insertPlusOneOption],
    ['click',         '#table_names > tbody:not(.for-empty-table)', onclickTableNames],

    ['change',        '#table_names > tbody:not(.for-empty-table)', onchangeTableNames],
    ['change',        '#switch_lang',                               changeLang],

    ['reset',         '#form-marmitas',                             formReset],

    ['submit',        '#form-marmitas',                             formSubmit],
    ['submit',        '#adicionar-nome',                            addNameInStorage],

    ['dragstart',     '#table_names > tbody:not(.for-empty-table)', startingDrag],
    ['dragend',       '#table_names > tbody:not(.for-empty-table)', endingDragController],
    ['dragover',      '#table_names > tbody:not(.for-empty-table)', movingDragElement],
    
    ['transitionend', '#addName',                                   focusInputText],
  ]

  for (const [ eventType, selector, func, options = {} ] of events) {
    listenerCreator.create(eventType, selector, func, options)
  }
}

const init = () => {
  const pageOk = routerCheck()

  if (!pageOk) {
    location = 'index.html'
    return
  }

  // CustomEncryption.checkEncryptionKey()

  defineLangHtml()
  mountCssColor()
  mountFormElements()
  mountTableNames()
  mountFooter()
  modifySortButtonAttribute()
  
  createEvents()
}

document.addEventListener('DOMContentLoaded', init)
