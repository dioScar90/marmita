import { getLocalStorage, setLocalStorage } from './utils.js'

const Names = (() => {
  const getNames = () => 'names' in localStorage ? getLocalStorage('names') : []

  const _getAscValue = () => {
    const actualAsc = 'sort' in localStorage ? getLocalStorage('sort') : false

    const asc = !actualAsc
    setLocalStorage('sort', asc)

    return asc
  }

  const _compareName = (n1, n2, asc) => asc ? n1.name.localeCompare(n2.name) : n2.name.localeCompare(n1.name)
  
  const sortNames = () => {
    const asc = _getAscValue()
    const names = getNames()

    const sortedNames = names.toSorted((n1, n2) => _compareName(n1, n2, asc))
    setLocalStorage('names', sortedNames)

    return sortedNames
  }
  
  const _filaDumaEgua = (id, oldIdx, newIdx, actualNames) => {
    const item = {...actualNames[oldIdx]}

    const tempNames = actualNames.toSpliced(oldIdx, 1)
    const newNames = tempNames.toSpliced(newIdx, 0, item)
    
    return newNames
  }

  const changeNamePosition = (id, newIdx) => {
    const [actualNames, oldIdx] = _findName(id)
    
    if (oldIdx === -1 || newIdx === oldIdx) {
      return false
    }
    
    const newNames = _filaDumaEgua(id, oldIdx, newIdx, actualNames)
    _updateNames(newNames)
    
    return newNames
  }

  const setNewName = (name) => {
    try {
      const actualNames = getNames() ?? []
      
      const isActive = true
      const id = self.crypto.randomUUID()
      const nameToAppend = { id, name, isActive }
      
      actualNames.push(nameToAppend)
      _updateNames(actualNames)
      
      return nameToAppend
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

    return newNames
  }

  const _findName = idToFind => {
    const actualNames = getNames() ?? []
    const idx = actualNames.findIndex(({ id }) => id === idToFind)
    return [actualNames, idx]
  }

  const _updateNames = names => setLocalStorage('names', names)

  return { getNames, setNewName, toggleActiveName, removeName, sortNames, changeNamePosition }
})()

export const { getNames, setNewName, toggleActiveName, removeName, sortNames, changeNamePosition } = Names
