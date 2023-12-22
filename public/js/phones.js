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

    const phones = getPhones()

    console.log(newPhone)

    if (phones.includes(newPhone)) {
      return false
    }
    
    phones.push(newPhone)
    const encryptedPhones = phones.map(p => Encryption.encrypt(p))

    console.log(encryptedPhones)

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
