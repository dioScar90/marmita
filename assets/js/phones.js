import Encryption from './encryption.js'
import { clearPhones, getStorage, setStorage } from './utils.js'

const Phones = (() => {
  const getPhoneById = (idToFind) => _findName(idToFind)

  const _getEncryptedPhones = () => 'phones' in localStorage ? getStorage('phones') : []

  const getPhones = () => {
    const encryptedPhones = _getEncryptedPhones()
    const phones = encryptedPhones.map((p) => ({ ...p, phone: Encryption.decrypt(p.phone) }))
    return phones
  }
  
  const setNewPhone = (newPhone) => {
    try {
      const phones = _getEncryptedPhones()
      
      const isActive = true
      const id = self.crypto.randomUUID()
      const phone = Encryption.encrypt(newPhone)
      const phoneToAppend = { id, phone, isActive }
      
      phones.push(phoneToAppend)
      _updatePhones(phones)
      
      return getPhoneById(id)
    } catch (err) {
      return false
    }
  }

  const removePhone = (phoneId) => {
    const phones = _getEncryptedPhones()
    const idx = phones.findIndex(({ id }) => id === phoneId)
    
    if (idx === -1) {
      return false
    }

    const newPhones = phones.toSpliced(idx, 1)
    
    setStorage('phones', newPhones)
    return getPhones()
  }

  const removeAllPhones = () => clearPhones()

  const _findName = idToFind => {
    const phones = getPhones()
    const phone = phones.find(({ id }) => id === idToFind)
    return phone
    // const actualNames = getNames() ?? []
    // const idx = actualNames.findIndex(({ id }) => id === idToFind)
    // return [actualNames, idx]
  }

  const _updatePhones = phones => setStorage('phones', phones)
  
  return { getPhones, setNewPhone, removePhone, removeAllPhones, getPhoneById }
})()

export const { getPhones, setNewPhone, removePhone, removeAllPhones, getPhoneById } = Phones
