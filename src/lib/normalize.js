const normalize = (() => {
  const getNormalizedValue = (value, type) => {
    switch (type) {
      case 'phone-number':
        return value
          .replace(/[\D]/g, '')
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5}|\d{4})(\d{4})/, '$1-$2')
          .replace(/(-\d{4})(\d+?)/, '$1')
      case 'cpf':
        return value
          .replace(/\D/g, '')
          .replace(/^(\d{5})(\d{3})+?$/, '$1-$2')
          .replace(/(-\d{3})(\d+?)/, '$1')
      case 'cnpj':
        return value
          .replace(/[\D]/g, '')
          .replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2')
          .replace(/(\d{4})(\d)/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1')
      default:
        return ''
    }
  }

  const checkValue = (value, type) => {
    if (!value) {
      return ''
    }

    return getNormalizedValue(value, type)
  }

  const phoneNumber = (value) => checkValue(value, 'phone-number')
  const cpf = (value) => checkValue(value, 'cpf')
  const cnpj = (value) => checkValue(value, 'cnpj')

  return { phoneNumber, cpf, cnpj }
})()

const normalizePhoneNumber = (value) => normalize.phoneNumber(value)
const normalizeCpf = (value) => normalize.cpf(value)
const normalizeCnpj = (value) => normalize.cnpj(value)

export { normalizePhoneNumber, normalizeCpf, normalizeCnpj }
