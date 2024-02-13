import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useFieldArray, useForm } from 'react-hook-form'

const FormName = () => {
  const { register, control, handleSubmit, getValues, setFocus, formState: { errors } } = useForm({
    defaultValues: { names: [{ name: '' }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'names' })
  
  const handleInput = (e) => {
    if (fields.length < 1) {
      return
    }
    
    const value = e.target.value.trim()
    const idInput = e.target.id
    
    const valueIsFromLastInput = fields.at(-1)?.id === idInput
    
    if (valueIsFromLastInput && value.length > 0) {
      appendOneMore()
      return
    }

    const valueIsFromSecondLastInput = fields.length > 2 && fields.at(-2)?.id === idInput
    
    if (valueIsFromSecondLastInput && !value.length) {
      // 50 milisec para dar tempo de 'getValues()' pegar os valores atualizados.
      setTimeout(removeLastEmptyFields, 50)
    }
  }
  
  const onSubmit = ({ names }) => {
    if (!names) {
      return
    }

    const okNames = names.map(({ name }) => name.trim()).filter(name => name.length > 0)
    console.log('data', okNames)
  }

  const getLastIndexesFromEmptyInputs = () => {
    const inputValues = getValues('names').map(({ name }) => name.trim())
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
  
  const removeLastEmptyFields = () => {
    const { indexesToRemove, indexToFocus } = getLastIndexesFromEmptyInputs()

    if (!indexesToRemove.length) {
      return
    }
    
    remove(indexesToRemove)
    setFocus(`names.${indexToFocus}.name`)
  }
  
  const appendOneMore = () => append({ name: '' }, { shouldFocus: false })
  
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      {fields?.map((field, i) => {
        const required = i > 0 && field.id === fields.at(-1).id ? false : { value: true, message: 'Informe um nome ou remova o campo' }
        const registerName = `names.${i}.name`

        const twoOrMoreFields = fields.length > 1
        const isLastIndex = i === fields.length - 1
        
        return (
          <Form.Group className="mb-3 " controlId={field.id} key={field.id}>
            {i === 0 && <Form.Label>Nome</Form.Label>}

            <div className={twoOrMoreFields && !isLastIndex ? 'position-relative' : ''}>
              <Form.Control
                type="text"
                {...register(registerName, { required })}
                onInput={handleInput}
                placeholder="Escreva um nome"
                className={'placeholder_input' + (errors.names?.[i]?.name ? ' border-danger' : '')}
              />
              
              {twoOrMoreFields && !isLastIndex &&
                <div className="position-absolute top-0 end-0 h-100 d-flex align-items-center px-2">
                  <Button
                    variant="warning" size="sm" type="button" tabIndex={-1}
                    className="py-0 px-1"
                    title="Click to remove this input" onClick={() => remove(i)}
                  >
                    &times;
                  </Button>
                </div>
              }
            </div>
            
            {errors.names?.[i]?.name && <span className="text-danger">{errors.names[i].name.message}</span>}
          </Form.Group>
        )
      })}
      
      <Button variant="primary" type="submit">
        Cadastrar
      </Button>

    </Form>
  )
}

export default FormName

