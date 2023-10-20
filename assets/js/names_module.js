const Names = (() => {
  const getNames = () =>
    localStorage.getItem('names') ? JSON.parse(localStorage.getItem('names')) : []

  const setNames = (...values) => {
    const actualNames = getNames() ?? []

    const namesToAppend = values.map(name => ({ name, isActive: true }))
    const newNames = [ ...actualNames, ...namesToAppend ]

    _updateNames(newNames)
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

  const _updateNames = names => localStorage.setItem('names', JSON.stringify(names))

  return { getNames, setNames, toggleActiveName, removeName, }
})()

const { getNames, setNames, toggleActiveName, removeName, } = Names
export { getNames, setNames, toggleActiveName, removeName, }
