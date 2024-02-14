const normalize = (value, type) => {
  const getNormalizedValue = (value, type) => {
    switch (type) {
      case 'phone':

        return value
          .replace(/[\D]/g, '')
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5}|\d{4})(\d{4})/, '$1-$2')
          .replace(/(-\d{4})(\d+?)/, '$1')

      case 'name':
        
        return value?.trim() ?? value

      case 'cpf':

        return value
          .replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1')

      case 'cnpj':

        return value
          .replace(/[\D]/g, '')
          .replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2')
          .replace(/(\d{4})(\d)/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1')

      case 'cep':

        return value
          .replace(/\D/g, '')
          .replace(/^(\d{5})(\d{3})+?$/, '$1-$2')
          .replace(/(-\d{3})(\d+?)/, '$1')

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

  return checkValue(value, type)
}

//   const phone = (value) => checkValue(value, 'phone')
//   const name  = (value) => checkValue(value, 'name')
//   const cpf   = (value) => checkValue(value, 'cpf')
//   const cnpj  = (value) => checkValue(value, 'cnpj')
//   const cep   = (value) => checkValue(value, 'cep')

//   return { phone, name, cpf, cnpj, cep }
// })()

// const normalizePhone = (value) => normalize.phone(value)
// const normalizeName = (value) => normalize.name(value)
// const normalizeCpf = (value) => normalize.cpf(value)
// const normalizeCnpj = (value) => normalize.cnpj(value)
// const normalizeCep = (value) => normalize.cep(value)

// export { normalizePhone, normalizeName, normalizeCpf, normalizeCnpj, normalizeCep }

export default normalize
