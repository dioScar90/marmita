import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { useFieldArray, useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
import { useEffect } from 'react'
import watchController from '../../lib/watchController'

// const schema = z.object({
//   phoneNumbers: z.string().regex(/^\(\d{2}\) (9\d{4}-\d{4}|3\d{3}-\d{4})$/)
// })

// const schemaPhones = z.array(schema)

const FormPhone = () => {
  const { register, control, handleSubmit, clearErrors, getValues, setValue, setFocus, watch, formState: { errors } } = useForm({
    // resolver: zodResolver(schemaPhones),
    defaultValues: { phoneNumbers: [{ phone: '' }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'phoneNumbers' })
  const phoneWatcher = watchController({ append, remove, getValues, setValue, setFocus, clearErrors })
  
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Exemplos:
      <br />
      - (11) <strong>9</strong>&nbsp;5465-1237
      <br />
      - (11) <strong>3</strong>&nbsp;569-1237
    </Tooltip>
  )
  
  const onSubmit = ({ phoneNumbers }) => {
    if (!phoneNumbers) {
      return
    }

    const okPhones = phoneNumbers.map(({ phone }) => phone.trim()).filter(phone => phone.length > 0)
    console.log('data', okPhones)
  }
  
  useEffect(() => {
    const subscription = watch(phoneWatcher)
    return () => subscription.unsubscribe()
  }, [watch])
  
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      {fields?.map((field, i) => {
        const hasMoreThenOneField = fields.length > 1
        const isLastIndex = i === fields.length - 1
        const notRequired = hasMoreThenOneField && isLastIndex

        const required = notRequired ? false : true
        const pattern = { value: /^\(\d{2}\) (9\d{4}-\d{4}|3\d{3}-\d{4})$/, message: 'Informe um número de telefone válido.' }
        const registerName = `phoneNumbers.${i}.phone`
        
        return (
          <Form.Group className="mb-3 " controlId={field.id} key={field.id}>
            {i === 0 && <Form.Label>Phone</Form.Label>}

            <div className={hasMoreThenOneField && !isLastIndex ? 'position-relative' : ''}>
              <Form.Control
                {...register(registerName, { required, pattern })}
                type="text" placeholder="Escreva um telefone"
                className={'placeholder_input' + (errors.phoneNumbers?.[i]?.phone ? ' border-danger' : '')}
              />
              
              {hasMoreThenOneField && !isLastIndex &&
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

