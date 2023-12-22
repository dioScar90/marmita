import {
  getNames,
  setNewName,
  toggleActiveName,
  removeName,
  sortNames,
  changeNamePosition,
} from './names.js'
import { getPhones, setNewPhone, removePhone, removeAllPhones } from './phones.js'
import {
  listenerCreator,
  getFormValues,
  getStorage,
  setStorage,
  clearNames,
  clearPhones,
} from './utils.js'
import { startingDrag, endingDrag, movingDragElement } from './drag_drop.js'
import Encryption from './encryption.js'

const MAX_TYPES = 5

const isPage = page => {
  const thisPage = location.pathname.split('/').at(-1)

  if (page === 'index' && thisPage === '') {
    return true
  }

  return [page, `${page}.html`].includes(thisPage)
}

const isIndexPage = () => isPage('index')
const isNamesPage = () => isPage('names')
const isPhonesPage = () => isPage('phones')

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
    '.' +
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

const addNewTableRowAfterNameInStorage = addedName => {
  const template = document.createElement('template')
  const tbody = getTbodyTableNames()
  const lastTr = tbody.querySelector('tr:nth-last-child(1)')

  const idx = lastTr ? lastTr.sectionRowIndex + 1 : 0
  const newTrHtml = getNewNamesTableRow(addedName, idx, true)
  template.innerHTML = newTrHtml

  tbody.append(template.content)
  const newTr = tbody.lastElementChild

  newTr.addEventListener('animationend', () => newTr.classList.remove('blink'))
}

const addNameInStorage = e => {
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

  addNewTableRowAfterNameInStorage(addedName)
  closeBtn?.click()
  form.reset()
}

const addNewTableRowAfterPhoneInStorage = addedPhone => {
  const template = document.createElement('template')
  const tbody = getTbodyTablePhones()
  const lastTr = tbody.querySelector('tr:nth-last-child(1)')

  // const idx = lastTr ? lastTr.sectionRowIndex + 1 : 0
  // const newTrHtml = getNewPhonesTableRow(addedPhone, idx, true)
  const newTrHtml = getNewPhonesTableRow(addedPhone, true)
  template.innerHTML = newTrHtml

  tbody.append(template.content)
  const newTr = tbody.lastElementChild

  newTr.addEventListener('animationend', () => newTr.classList.remove('blink'))
}

const addPhoneInStorage = e => {
  e.preventDefault()

  const form = e.target
  const button = e.submitter

  const values = getFormValues(form)

  const modal = button.closest('#addPhone')
  const closeBtn = modal.querySelector('button.btn-close')

  const addedPhone = setNewPhone(values.phone)

  if (!addedPhone) {
    return
  }

  addNewTableRowAfterPhoneInStorage(addedPhone)
  closeBtn?.click()
  form.reset()
}

const focusInputText = e => {
  const modal = e.currentTarget
  const input = modal.querySelector('input[name="name"]')

  if (e.target !== modal || !modal.classList.contains('show')) {
    return
  }

  setTimeout(() => input.focus(), 500)
}

const removeTrName = async (tr, names) => {
  tr.classList.add('to-remove')
  tr.addEventListener('transitionend', () => {
    tr.remove()
    mountTableNames(names)
  })
}

const removeNameInStorage = e => {
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
    removeTrName(tr, names)

    closeBtn?.click()
  } catch (err) {
    alert(err.toString())
  }
}

const removeTrPhone = async (tr, phones) => {
  tr.classList.add('to-remove')
  tr.addEventListener('transitionend', () => {
    tr.remove()
    mountTablePhones(phones)
  }, {once: true})
}

const removePhoneInStorage = e => {
  try {
    const button = e.currentTarget
    const modal = button.closest('#removePhone')
    const closeBtn = modal.querySelector('button.btn-close')

    const id = button.dataset?.phoneId
    const phones = removePhone(id)

    if (!phones) {
      return
    }

    const tr = document.querySelector(`tr[data-phone-id="${id}"`)
    removeTrPhone(tr, phones)

    closeBtn?.click()
  } catch (err) {
    alert(err.toString())
  }
}

const removeAllNames = e => {
  const button = e.currentTarget
  const modal = button.closest('#removeAllNames')
  const closeBtn = modal.querySelector('button.btn-close')

  const tbody = document.querySelector('#table_names > tbody:last-child')
  tbody.replaceChildren()

  clearNames()

  closeBtn.click()
}

const removeAllPhonesInStorage = e => {
  const button = e.currentTarget
  const modal = button.closest('#removeAllPhones')
  const closeBtn = modal.querySelector('button.btn-close')

  const tbody = document.querySelector('#table_phones > tbody:last-child')
  tbody.replaceChildren()

  clearPhones()

  closeBtn.click()
}

const modifySortButtonAttribute = () => {
  const button = document.querySelector('[data-sort-names]')

  if (!button) {
    return
  }

  const asc = getStorage('sort')
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

const copyText = async e => {
  const formMarmitas = document.querySelector('#form-marmitas')
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

const gerarPedidosObj = values => {
  const obj = {}

  for (const key in values) {
    const value = values[key]

    obj[value] ??= []
    obj[value].push(key)
  }

  return obj
}

const getPedidosParaTextoFinal = pedidosObj => {
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

  const form = e.target
  const values = getFormValues(form)

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

const onclickTableNames = e => {
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

const onclickTablePhones = e => {
  const button = e.target.closest('button:is([data-remove], [data-order])')

  if (!button) {
    return
  }

  const tr = button.closest('tr')

  if ('remove' in button.dataset) {
    confirmRemovePhone(tr.dataset)
    return
  }

  // if ('order' in button.dataset) {
  //   prepareChangePhone(tr, button.dataset.order)
  //   return
  // }
}

const onchangeTableNames = e => {
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

const getOptionSalad = nome => getNewDivOption('salada', nome)

const getNewFormElement = nome => {
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
  allBtnDisabled.forEach(btn => (btn.disabled = false))
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

const getTbodyTablePhones = () => {
  const table = document.querySelector('#table_phones')
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
  const buttonConfirm = document.querySelector(
    '#removeName .modal-footer button[data-remove-name-confirm]'
  )

  titleSpan.innerText = name
  paragSpan.innerText = name
  buttonConfirm.dataset.name = name
  buttonConfirm.dataset.nameId = nameId

  buttonOpen.click()
}

const getNewNamesTableRow = ({ id, name, isActive }, idx, blink = false) => {
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
          <div class="col px-1" hidden>
            <button type="button" class="btn btn-outline-warning btn-sm m-0" data-order="down">
              <i class="fa-solid fa-caret-down"></i>
            </button>
          </div>
          <div class="col px-1" hidden>
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

const updateNamesTableRow = (tr, { id, name, isActive }) => {
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
    const tr = tbody.querySelector(`tr:nth-child(${i + 1})`)

    if (!tr) {
      const newTR = getNewNamesTableRow(names[i], i, blink)
      template.innerHTML += newTR
      continue
    }

    updateNamesTableRow(tr, names[i])
  }

  if (!template.content.childElementCount) {
    return
  }

  tbody.append(template.content)
}

const formatPhoneNumber = phone => {
  // Validate if the input is a string
  if (typeof phone !== 'string') {
    throw new Error('Input must be a string')
  }

  // Remove non-numeric characters from the input
  const cleanedNumber = phone.replace(/\D/g, '')

  // Check if the cleaned number has at least 7 digits
  if (cleanedNumber.length < 11) {
    throw new Error('Phone number must have at least 11 digits')
  }

  // Extract the three parts
  const ddd = cleanedNumber.slice(0, 2)
  const secondPart = cleanedNumber.slice(2, -4)
  const thirdPart = cleanedNumber.slice(-4)

  const formattedPhoneNumber = `(${ddd}) ${secondPart}-${thirdPart}`
  return formattedPhoneNumber
}

// const prepareChangePhone = (tr, order) => {
//   const asc = order === 'up'
//   changePositionTableRows(tr, asc)

//   const phones = changePhonePosition(tr.dataset.phoneId, tr.sectionRowIndex)

//   if (!phones) {
//     return
//   }

//   mountTablePhones(phones)
// }

const confirmRemovePhone = ({ phoneId, phone }) => {
  const buttonOpen = document.querySelector('button[data-bs-target="#removePhone"]')

  const titleSpan = document.querySelector('#removePhone .modal-title span[data-phone]')
  const paragSpan = document.querySelector('#removePhone .modal-body span[data-phone]')
  const buttonConfirm = document.querySelector(
    '#removePhone .modal-footer button[data-remove-phone-confirm]'
  )

  titleSpan.innerText = phone
  paragSpan.innerText = phone
  buttonConfirm.dataset.phone = phone
  buttonConfirm.dataset.phoneId = phoneId

  buttonOpen.click()
}

const getNewPhonesTableRow = ({ id, phone, isActive }, blink = false) => {
  const checked = isActive ? 'checked' : ''
  const radioId = `status_${id}`

  const blinkClass = blink ? 'class="blink"' : ''

  const newTR = `
    <tr ${blinkClass} data-phone-id="${id}" data-phone="${phone}" draggable="true">
      <th scope="row"></th>
      <td>
        ${formatPhoneNumber(phone)}
      </td>
      <td class="col col-md-3">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="${radioId}" ${checked} data-status>
          <label class="form-check-label fw-bold" for="${radioId}" data-ativo="Ativo" data-inativo="Inativo"></label>
        </div>
      </td>
      <td class="col-1">
        <div class="row">
          <div class="col px-1">
            <button type="button" class="btn btn-outline-danger btn-sm m-0" data-remove>
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
          <div class="col px-1" hidden>
            <button type="button" class="btn btn-outline-warning btn-sm m-0" data-order="down">
              <i class="fa-solid fa-caret-down"></i>
            </button>
          </div>
          <div class="col px-1" hidden>
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

const updatePhonesTableRow = (tr, { id, name, isActive }) => {
  const checkbox = tr.querySelector('input[type=checkbox]')

  tr.dataset.nameId = id
  checkbox.checked = isActive

  tr.children[1].innerText = name
}

const mountTablePhones = (phonesArg = null) => {
  if (!isPhonesPage()) {
    return
  }

  const phones = phonesArg ?? getPhones()

  const template = document.createElement('template')
  const tbody = getTbodyTablePhones()
  
  for (const p of phones) {
    const newTR = getNewPhonesTableRow(p)
    template.innerHTML += newTR
  }
  
  if (!template.content.childElementCount) {
    return
  }

  tbody.replaceChildren(template.content)
}

const endingDragController = e => {
  const names = endingDrag(e)

  if (!names) {
    return
  }

  mountTableNames(names)
}

const getByChecks = limit => {
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

const formatarNumero = e => {
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

const getLang = defaultLang => {
  if (!('lang' in localStorage)) {
    setStorage('lang', defaultLang)
  }

  return getStorage('lang')
}

const changeLang = e => {
  const inputSwitch = e.target

  setStorage('lang', inputSwitch.value)
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
  const acceptedPages = ['index', 'names', 'phones']
  return acceptedPages.some(page => isPage(page))
}

const createEvents = () => {
  const events = [
    ['click', 'button[data-copiar]', copyText],
    ['click', 'button[data-remove-name-confirm]', removeNameInStorage],
    ['click', 'button[data-remove-phone-confirm]', removePhoneInStorage],
    ['click', 'button[data-remove-all-names-confirm]', removeAllNames],
    ['click', 'button[data-remove-all-phones-confirm]', removeAllPhonesInStorage],
    ['click', 'button[data-sort-names]', sortNamesInTable],
    ['click', '#plus_one_more_option', insertPlusOneOption],
    ['click', '#table_names > tbody:not(.for-empty-table)', onclickTableNames],
    ['click', '#table_phones > tbody:not(.for-empty-table)', onclickTablePhones],

    ['change', '#table_names > tbody:not(.for-empty-table)', onchangeTableNames],
    // ['change', '#table_phones > tbody:not(.for-empty-table)', onchangeTablePhones],
    ['change', '#switch_lang', changeLang],

    ['submit', '#form-marmitas', formSubmit],
    ['submit', '#adicionar-nome', addNameInStorage],
    ['submit', '#adicionar-phone', addPhoneInStorage],

    ['input', '#phone', formatarNumero],

    ['dragstart', '#table_names > tbody:not(.for-empty-table)', startingDrag],
    ['dragend', '#table_names > tbody:not(.for-empty-table)', endingDragController],
    ['dragover', '#table_names > tbody:not(.for-empty-table)', movingDragElement],

    ['transitionend', '#addName', focusInputText],
  ]

  for (const [eventType, selector, func, options = {}] of events) {
    listenerCreator.create(eventType, selector, func, options)
  }
}

const init = () => {
  const pageOk = routerCheck()

  if (!pageOk) {
    location = 'index.html'
    return
  }

  Encryption.checkEncryptionKey()

  defineLangHtml()
  mountCssColor()
  mountFormElements()
  mountTableNames()
  mountTablePhones()
  mountFooter()
  modifySortButtonAttribute()

  createEvents()
}

document.addEventListener('DOMContentLoaded', init)
