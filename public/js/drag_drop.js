import { replaceAllNames } from './utils.js'

const updateAllNamesByTable = (table) => {
  const tableRows = table.querySelectorAll(':scope > tr')
  const names = []

  for (const tr of tableRows) {
    const input = tr.querySelector('[type="checkbox"]')

    const name = tr.dataset.name
    const isActive = input.checked
    const newName = {name, isActive}

    tr.dataset.nameId = tr.sectionRowIndex
    tr.firstElementChild.innerText = (tr.sectionRowIndex + 1).toString().padStart(2, '0')
    names.push(newName)
  }

  replaceAllNames(names)
}

const startingDrag = (e) => {
  e.target.classList.add('dragging')
}

const endingDrag = (e) => {
  const dragging = e.target
  dragging.classList.remove('dragging')

  const table = e.currentTarget
  updateAllNamesByTable(table)
}

const getNewPosition = (item, posY) => {
  const box = item.getBoundingClientRect()
  const boxCenterY = box.y + box.height / 2

  return posY >= boxCenterY
}

const movingDragElement = (e) => {
  const item = e.target.closest('[draggable="true"]')
  const dragging = document.querySelector('.dragging')
  
  if (dragging === item) {
    return
  }

  const applyAfter = getNewPosition(item, e.clientY)

  if (applyAfter) {
    item.after(dragging)
    return
  }

  item.before(dragging)
}

export { startingDrag, endingDrag, movingDragElement }