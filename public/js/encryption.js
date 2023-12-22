import { clearPhones, getStorage, setStorage } from './utils.js'

class Encryption {
  static #charsetKey =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?'
  static #keyLength = 36

  static #getEncryptionKey() {
    if (!('encryption_key' in localStorage)) {
      this.#generateKey()
    }

    return getStorage('encryption_key')
  }

  static encrypt(text) {
    const key = this.#getEncryptionKey()
    const charArr = []

    for (const i in text) {
      const item = String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
      charArr.push(item)
    }

    const result = charArr.join('')
    return btoa(result)
  }

  static decrypt(encryptedText) {
    const key = this.#getEncryptionKey()
    const atobText = atob(encryptedText)
    const charArr = []

    for (const i in atobText) {
      const item = String.fromCharCode(atobText.charCodeAt(i) ^ key.charCodeAt(i % key.length))
      charArr.push(item)
    }

    return charArr.join('')
  }

  static #generateKey() {
    clearPhones()
    const charArr = []

    for (let i = 0; i < this.#keyLength; i++) {
      const randomIndex = Math.floor(Math.random() * this.#charsetKey.length)
      const item = this.#charsetKey.charAt(randomIndex)
      charArr.push(item)
    }

    const keyValue = charArr.join('')
    setStorage('encryption_key', keyValue)
  }

  static generateKey = () => this.#generateKey()

  static checkEncryptionKey() {
    const key = this.#getEncryptionKey()
    
    if (!key) {
      this.#generateKey()
    }
  }
}

export default Encryption
