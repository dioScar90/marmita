import { getLocalStorage, setLocalStorage } from './utils.js'

const Names = (() => {
  const getNames = () => 'names' in localStorage ? getLocalStorage('names') : []

  const _getAscValue = () => {
    const actualAsc = 'sort' in localStorage ? getLocalStorage('sort') : false

    const asc = !actualAsc
    setLocalStorage('sort', asc)

    return asc
  }

  const _compareName = (n1, n2, asc) => {
    if (asc) {
      return n1.name.localeCompare(n2.name)
    }

    return n2.name.localeCompare(n1.name)
  }

  const sortNames = () => {
    const asc = _getAscValue()
    const names = getNames()

    const sortedNames = names.toSorted((n1, n2) => _compareName(n1, n2, asc))
    setLocalStorage('names', sortedNames)

    return sortedNames
  }

  const _checkNameLimit = (actualNames, idx, up) => {
    if (up === true && actualNames[idx] === actualNames.at(0)) {
      return true
    }

    if (up === false && actualNames[idx] === actualNames.at(-1)) {
      return true
    }

    return false
  }

  const changeNamePosition = (idToChangePosition, up) => {
    const [actualNames, idx] = _findName(idToChangePosition)

    if (idx === -1) {
      return false
    }

    const nameIsAlreadyInTheLimit = _checkNameLimit(actualNames, idx, up)

    if (nameIsAlreadyInTheLimit) {
      return false
    }

    const start = up === true ? idx - 1 : idx
    const deleteCount = 2
    const firstItem = up === true ? actualNames[idx] : actualNames[idx + 1]
    const secondItem = up === true ? actualNames[idx - 1] : actualNames[idx]
    const newNames = actualNames.toSpliced(start, deleteCount, {...firstItem}, {...secondItem})
    
    setLocalStorage('names', newNames)
    return newNames
  }

  const _filaDumaEgua = (idBefore, idxAfter, actualNames) => {
    const itemAfter = {...actualNames[idxAfter]}

    if (!idBefore) {
      const tempNames = actualNames.toSpliced(idxAfter, 1)
      const newNames = tempNames.toSpliced(0, 0, itemAfter)
      return newNames
    }

    const [_, idxBefore] = _findName(idBefore)
    const tempNames = actualNames.toSpliced(idxBefore + 1, 0, itemAfter)

    const newNames = tempNames.toSpliced(idxAfter, 1)
    return newNames
  }

  const changeNameMoreThenTwoPositions = (idBefore, idAfter) => {
    const [actualNames, idxAfter] = _findName(idAfter)
    
    if (idxAfter === -1) {
      return false
    }
    
    const newNames = _filaDumaEgua(idBefore, idxAfter, actualNames)
    
    setLocalStorage('names', newNames)
    return newNames
  }

  const setNames = (...values) => {
    try {
      const actualNames = getNames() ?? []
  
      const namesToAppend = values.map(name => {
        const isActive = true
        const id = self.crypto.randomUUID()

        return { id, name, isActive }
      })
      const newNames = [ ...actualNames, ...namesToAppend ]
  
      _updateNames(newNames)
  
      return namesToAppend[0]
    } catch (err) {
      return false
    }
  }

  const toggleActiveName = (idToToggle, isActive = false) => {
    const [actualNames, idx] = _findName(idToToggle)

    if (idx === -1) {
      return false
    }

    actualNames[idx].isActive = isActive
    _updateNames(actualNames)

    return true
  }

  const removeName = idToRemove => {
    const [actualNames, idx] = _findName(idToRemove)

    if (idx === -1) {
      return false
    }

    const newNames = actualNames.toSpliced(idx, 1)
    _updateNames(newNames)

    return true
  }

  const _findName = idToFind => {
    const actualNames = getNames() ?? []
    const idx = actualNames.findIndex(({ id }) => id === idToFind)
    return [actualNames, idx]
  }

  const _updateNames = names => setLocalStorage('names', names)

  return { getNames, setNames, toggleActiveName, removeName, sortNames, changeNamePosition, changeNameMoreThenTwoPositions }
})()

export const { getNames, setNames, toggleActiveName, removeName, sortNames, changeNamePosition, changeNameMoreThenTwoPositions } = Names
