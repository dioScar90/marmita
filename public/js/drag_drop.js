const startDragEvents = () => {
  const columns = document.querySelectorAll('tr[draggable="true"]')
  
  document.addEventListener('dragstart', e => e.target.classList.add('dragging'))
  document.addEventListener('dragend', e => e.target.classList.remove('dragging'))
  
  columns.forEach(item => {
    item.addEventListener('dragover', e => {
      const dragging = document.querySelector('.dragging')
      const applyAfter = getNewPosition(item, e.clientX)
      
      if (applyAfter) {
        applyAfter.after(dragging)
      } else {
        item.before(dragging)
      }
    })
  })
}

const getNewPosition = (column, posX) => {
  const cards = column.querySelectorAll('tr[draggable="true"]:not(.dragging)')
  
  for (const referCard of cards) {
    const box = referCard.getBoundingClientRec()
    const boxCenterX = box.y + box.height / 2
    
    if (posX >= boxCenterX) {
      return referCard
    }
  }
  
  return false
}
