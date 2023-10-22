import { getLocalStorage, setLocalStorage } from './utils.js'

const Names = (() => {
  const getNames = () => 'names' in localStorage ? getLocalStorage('names') : []

  const getAscValue = () => {
    const actualAsc = 'sort' in localStorage ? getLocalStorage('sort') : false

    const asc = !actualAsc
    setLocalStorage('sort', asc)

    return asc
  }

  const compareName = (name1, name2, asc) => {
    if (asc) {
      return name1.name.localeCompare(name2.name)
    }

    return name2.name.localeCompare(name1.name)
  }

  const sortNames = () => {
    const asc = getAscValue()
    const names = getNames()

    const sortedNames = names.toSorted((n1, n2) => compareName(n1, n2, asc))
    setLocalStorage('names', sortedNames)

    return sortedNames
  }

  const checkNameLimit = (actualNames, idx, up) => {
    if (up === true && actualNames[idx] === actualNames.at(0)) {
      return true
    }

    if (up === false && actualNames[idx] === actualNames.at(-1)) {
      return true
    }

    return false
  }

  const changeNamePosition = (nameToChangePosition, up) => {
    const { actualNames, idx } = _findName(nameToChangePosition)

    if (idx === -1) {
      return false
    }

    const nameIsAlreadyInTheLimit = checkNameLimit(actualNames, idx, up)

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

  const setNames = (...values) => {
    try {
      const actualNames = getNames() ?? []
  
      const namesToAppend = values.map(name => ({ name, isActive: true }))
      const newNames = [ ...actualNames, ...namesToAppend ]
  
      _updateNames(newNames)
  
      return namesToAppend[0]
    } catch (err) {
      return false
    }
  }

  const toggleActiveName = (nameToToggle, isActive = false) => {
    const { actualNames, idx } = _findName(nameToToggle)

    if (idx === -1) {
      return false
    }

    actualNames[idx].isActive = isActive
    _updateNames(actualNames)

    return true
  }

  const removeName = nameToRemove => {
    const { actualNames, idx } = _findName(nameToRemove)

    if (idx === -1) {
      return false
    }

    const newNames = actualNames.toSpliced(idx, 1)
    _updateNames(newNames)

    return true
  }

  const _findName = nameToFind => {
    const actualNames = getNames() ?? []
    const idx = actualNames.findIndex(({ name }) => name === nameToFind)
    return { actualNames, idx }
  }

  const _updateNames = names => setLocalStorage('names', names)

  return { getNames, setNames, toggleActiveName, removeName, sortNames, changeNamePosition }
})()

const { getNames, setNames, toggleActiveName, removeName, sortNames, changeNamePosition } = Names
export { getNames, setNames, toggleActiveName, removeName, sortNames, changeNamePosition }
