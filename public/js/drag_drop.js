import { changeNameMoreThenTwoPositions } from './names.js'

const updateAllNamesByTable = (tr) => {
  const idModifiedTr = tr.dataset.nameId
  const idBeforeModified = tr.previousElementSibling?.dataset.nameId
  return changeNameMoreThenTwoPositions(idBeforeModified, idModifiedTr)
}

const startingDrag = (e) => {
  e.target.classList.add('dragging')
}

const endingDrag = (e) => {
  const dragging = e.target
  dragging.classList.remove('dragging')

  return updateAllNamesByTable(dragging)
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