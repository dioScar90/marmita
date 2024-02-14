import normalize from './mask';

const watchController = ({ append, remove, getValues, setValue, setFocus, skipMask }) => {
  const getLastIndexesFromEmptyInputs = (fieldsName, field) => {
    const inputValues = getValues(fieldsName).map(f => f[field].trim())
    const indexes = [];
  
    for (let i = inputValues.length - 1; i >= 0; i--) {
      if (inputValues[i].length > 0) {
        break
      }
      
      indexes.push(i)
    }
  
    const indexesToRemove = indexes.toSpliced(-1)
    const indexToFocus = indexes.at(-1)
    
    return { indexesToRemove, indexToFocus }
  }
  
  const removeLastEmptyFields = (fieldsName, field) => {
    const { indexesToRemove, indexToFocus } = getLastIndexesFromEmptyInputs(fieldsName, field)
  
    if (!indexesToRemove.length) {
      return
    }
    
    remove(indexesToRemove)
    setFocus(`${fieldsName}.${indexToFocus}.${field}`)
  }
  
  const appendOneMore = (field) => append({ [field]: '' }, { shouldFocus: false })
  
  const handleInput = ({ data, name, fieldsName, i, field }) => {
    if (data.length < 1) {
      return
    }
  
    const valueIsNotEmptyAndIsFromLastInput = () => +i === data.length - 1 && !!getValues(name)
    const valueIsEmptyAndIsFromSecondLastInput = () => data.length > 2 && +i === data.length - 2 && !getValues(name)
    
    const value = data[i][field]

    if (!skipMask) {
      setValue(name, normalize(value, field))
    }
    
    if (valueIsNotEmptyAndIsFromLastInput()) {
      return appendOneMore(field)
    }
    
    if (valueIsEmptyAndIsFromSecondLastInput()) {
      // 50 milisec para dar tempo de 'getValues()' pegar os valores atualizados.
      setTimeout(removeLastEmptyFields, 50, fieldsName, field)
    }
  }
  
  const controlWatchCallback = (data, { name, type }, alloweds = []) => {
    if (!alloweds.includes(type)) {
      return
    }
    
    try {
      const [ fieldsName, i, field ] = name.split('.')
      const param = { data: data[fieldsName], name, fieldsName, i, field }
      return handleInput(param)
    } catch (err) {
      console.log('error =>', err)
    }
  }
  
  const controller = (data, obj) => {
    const alloweds = ['change', 'input']
    return controlWatchCallback(data, obj, alloweds)
  }
  
  return controller
}

export default watchController
