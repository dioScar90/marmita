import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { useFieldArray, useForm } from 'react-hook-form'
import { normalizePhoneNumber } from '../../lib/normalize'

const FormPhone = () => {
  const { register, control, handleSubmit, getValues, setFocus, formState: { errors } } = useForm({
    defaultValues: { phoneNumbers: [{ phone: '' }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'phoneNumbers' })

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Exemplos:
      <br />
      - (11) <strong>9</strong>&nbsp;5465-1237
      <br />
      - (11) <strong>3</strong>&nbsp;569-1237
    </Tooltip>
  )
  
  const handleInput = (e) => {
    if (fields.length < 1) {
      return
    }
    
    const valueNotNormalizedYet = e.target.value.trim()
    const value = normalizePhoneNumber(valueNotNormalizedYet)
    const idInput = e.target.id

    e.target.value = value
    
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
  
  const onSubmit = ({ phoneNumbers }) => {
    if (!phoneNumbers) {
      return
    }

    const okPhones = phoneNumbers.map(({ phone }) => phone.trim()).filter(phone => phone.length > 0)
    console.log('data', okPhones)
  }

  const getLastIndexesFromEmptyInputs = () => {
    const inputValues = getValues('phoneNumbers').map(({ phone }) => phone.trim())
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
    setFocus(`phoneNumbers.${indexToFocus}.phone`)
  }
  
  const appendOneMore = () => append({ phone: '' }, { shouldFocus: false })
  
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      {fields?.map((field, i) => {
        const required = i > 0 && field.id === fields.at(-1).id ? false : true
        const pattern = {
          value: /^\(\d{2}\) (9\d{4}-\d{4}|3\d{3}-\d{4})$/,
          // message: 'Informe um número de telefone válido. Ex.: (11) 95465-1237',
          message: 'Informe um número de telefone válido.',
        }
        const explanation = 'Exemplos de números de telefones:\n- (11) 95465-1237, celular, começando com "9"\n- (11) 3569-1237, fixo, começando com "3"'
        
        const registerName = `phoneNumbers.${i}.phone`
        
        const twoOrMoreFields = fields.length > 1
        const isLastIndex = i === fields.length - 1
        
        return (
          <Form.Group className="mb-3 " controlId={field.id} key={field.id}>
            {i === 0 && <Form.Label>Nome</Form.Label>}

            <div className={twoOrMoreFields && !isLastIndex ? 'position-relative' : ''}>
              <Form.Control
                {...register(registerName, { required, pattern, explanation })}
                type="text" placeholder="Escreva um telefone"
                onInput={handleInput}
                className={'placeholder_input' + (errors.phoneNumbers?.[i]?.phone ? ' border-danger' : '')}
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
            
            {errors.phoneNumbers?.[i]?.phone &&
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400, width: 500 }}
                overlay={renderTooltip}
              >
                <span className="text-danger">
                  {errors.phoneNumbers[i].phone.message}
                </span>
              </OverlayTrigger>
            }
          </Form.Group>
        )
      })}
      
      <Button variant="primary" type="submit">
        Cadastrar
      </Button>

    </Form>
  )
}

export default FormPhone

