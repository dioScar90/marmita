import { getLocalStorage, setLocalStorage } from './utils.js'

class CustomEncryption {
	static #charsetKey = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?'
	static #keyLength = 36

  static encrypt(text, key) {
		const charArr = []

		for (const i in text) {
      const item = String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
			charArr.push(item)
		}
		
		const result = charArr.join('')
    return btoa(result)
  }

  static decrypt(encryptedText, key) {
		const atobText = atob(encryptedText)
		const charArr = []

		for (const i in atobText) {
      const item = String.fromCharCode(atobText.charCodeAt(i) ^ key.charCodeAt(i % key.length))
			charArr.push(item)
		}
		
		return charArr.join('')
  }

	static #generateKey() {
		const charArr = []
		
		for (let i = 0; i < this.#keyLength; i++) {
			const randomIndex = Math.floor(Math.random() * this.#charsetKey.length)
			const item = this.#charsetKey.charAt(randomIndex)
			charArr.push(item)
		}

		const keyValue = charArr.join('')
		setLocalStorage('encryption_key', keyValue)
	}

	static checkEncryptionKey() {
		const key = getLocalStorage('encryption_key')
		
		if (!key) {
			localStorage.removeItem('encryption_key')
			localStorage.removeItem('phone_numbers')
			this.#generateKey()
		}
	}
}

export default CustomEncryption
