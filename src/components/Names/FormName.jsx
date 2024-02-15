import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useFieldArray, useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
import { useEffect } from 'react'
import watchController from '../../lib/watchController'

// const schema = z.object({
//   names: z.string().trim().min(1, { message: 'Sua mãe é toda minha' })
// })

// const schemaNames = z.array(schema)

const FormName = () => {
  const { register, control, handleSubmit, clearErrors, getValues, setValue, setFocus, watch, formState: { errors } } = useForm({
    // resolver: zodResolver(schemaNames),
    defaultValues: { names: [{ name: '' }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'names' })
  const nameWatcher = watchController({ append, remove, getValues, setValue, setFocus, clearErrors, skipMask: true })
  
  const onSubmit = ({ names }) => {
    if (!names) {
      return
    }

    const okNames = names.map(({ name }) => name.trim()).filter(name => name.length > 0)
    console.log('data', okNames)
  }
  
  useEffect(() => {
    const subscription = watch(nameWatcher)
    return () => subscription.unsubscribe()
  }, [watch])
  
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      {fields?.map((field, i) => {
        const hasMoreThenOneField = fields.length > 1
        const isLastIndex = i === fields.length - 1
        const notRequired = hasMoreThenOneField && isLastIndex

        const required = notRequired ? { value: false } : { value: true, message: 'Informe um nome ou remova o campo' }
        const registerName = `names.${i}.name`
        
        return (
          <Form.Group className="mb-3 " controlId={field.id} key={field.id}>
            {i === 0 && <Form.Label>Nome</Form.Label>}

            <div className={hasMoreThenOneField && !isLastIndex ? 'position-relative' : ''}>
              <Form.Control
                type="text"
                {...register(registerName, { required })}
                placeholder="Escreva um nome"
                className={'placeholder_input' + (errors.names?.[i]?.name ? ' border-danger' : '')}
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

