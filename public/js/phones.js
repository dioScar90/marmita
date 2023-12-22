import Encryption from './encryption.js'
import { clearPhones, getStorage, setStorage } from './utils.js'

const Phones = (() => {
  const getPhones = () => {
    const encryptedPhones = 'phones' in localStorage ? getStorage('phones') : []
    const phones = encryptedPhones.map(p => Encryption.decrypt(p))
    return phones
  }

  const setNewPhone = (newPhone) => {
    const phones = getPhones()

    if (phones.includes(newPhone)) {
      return false
    }
    
    phones.push(newPhone)
    const encryptedPhones = phones.map(p => Encryption.encrypt(p))

    setStorage('phones', encryptedPhones)
    return newPhone
  }

  const removePhone = (phone) => {
    const phones = getPhones()
    const idx = phones.findIndex(phone)

    if (idx === -1) {
      return false
    }

    const phonesWithoutInformedPhone = phones.toSpliced(idx, 1)
    const newPhones = phonesWithoutInformedPhone.map(p => Encryption.encrypt(p))

    setStorage('phones', newPhones)
    return true
  }

  const removeAllPhones = () => clearPhones()

  // const getNames = () => 'names' in localStorage ? getStorage('names') : []

  // const _getAscValue = () => {
  //   const actualAsc = 'sort' in localStorage ? getStorage('sort') : false

  //   const asc = !actualAsc
  //   setStorage('sort', asc)

  //   return asc
  // }

  // const _compareName = (n1, n2, asc) => asc ? n1.name.localeCompare(n2.name) : n2.name.localeCompare(n1.name)
  
  // const sortNames = () => {
  //   const asc = _getAscValue()
  //   const names = getNames()

  //   const sortedNames = names.toSorted((n1, n2) => _compareName(n1, n2, asc))
  //   setStorage('names', sortedNames)

  //   return sortedNames
  // }
  
  // const _filaDumaEgua = (id, oldIdx, newIdx, actualNames) => {
  //   const item = {...actualNames[oldIdx]}

  //   const tempNames = actualNames.toSpliced(oldIdx, 1)
  //   const newNames = tempNames.toSpliced(newIdx, 0, item)
    
  //   return newNames
  // }

  // const changeNamePosition = (id, newIdx) => {
  //   const [actualNames, oldIdx] = _findName(id)
    
  //   if (oldIdx === -1 || newIdx === oldIdx) {
  //     return false
  //   }
    
  //   const newNames = _filaDumaEgua(id, oldIdx, newIdx, actualNames)
  //   _updateNames(newNames)
    
  //   return newNames
  // }

  // const setNewName = (name) => {
  //   try {
  //     const actualNames = getNames() ?? []
      
  //     const isActive = true
  //     const id = self.crypto.randomUUID()
  //     const nameToAppend = { id, name, isActive }
      
  //     actualNames.push(nameToAppend)
  //     _updateNames(actualNames)
      
  //     return nameToAppend
  //   } catch (err) {
  //     return false
  //   }
  // }

  // const toggleActiveName = (idToToggle, isActive = false) => {
  //   const [actualNames, idx] = _findName(idToToggle)

  //   if (idx === -1) {
  //     return false
  //   }

  //   actualNames[idx].isActive = isActive
  //   _updateNames(actualNames)

  //   return true
  // }

  // const removeName = idToRemove => {
  //   const [actualNames, idx] = _findName(idToRemove)

  //   if (idx === -1) {
  //     return false
  //   }

  //   const newNames = actualNames.toSpliced(idx, 1)
  //   _updateNames(newNames)

  //   return newNames
  // }

  // const _findName = idToFind => {
  //   const actualNames = getNames() ?? []
  //   const idx = actualNames.findIndex(({ id }) => id === idToFind)
  //   return [actualNames, idx]
  // }

  // const _updateNames = names => setStorage('names', names)

  return { getPhones, setNewPhone, removePhone, removeAllPhones }
})()

export const { getPhones, setNewPhone, removePhone, removeAllPhones } = Phones
