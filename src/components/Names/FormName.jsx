import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useFieldArray, useForm } from 'react-hook-form'


const FormName = () => {
  console.log('render')
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      names: [{ name: '' }, { name: '' }]
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'names'
  })

  // useEffect(() => {
  //   console.log('watch', watch('name'))
  // }, [watch])

  const handleInput = (e) => {
    const value = e.target.value
    const name = e.target.name

    console.log('value', value)
    console.log('name', name)
    console.log('fields', fields)

    if (value.trim() === '') {
      console.log('value is empty')
      return
    }

    const valueIsFromLastInput = fields.length > 0 && fields.at(-1).id === e.target.id

    if (!valueIsFromLastInput) {
      console.log('value is not from last input')
      return
    }


    append({ name: '' }, { shouldFocus: false })
  }

  const onSubmit = (data) => {
    console.log('data', data)
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {fields?.map((field, i) => {
        const required = i > 0 && field.id === fields.at(-1) ? false : { value: true, message: 'Name is required' }
        // const required = { value: true, message: 'Name is required' }

        return (
          <Form.Group className="mb-3 " controlId={field.id} key={field.id}>
            {i === 0 && <Form.Label>Nome</Form.Label>}

            <div className="position-relative">
              <Form.Control
                type="text"
                {...register(`names.${i}.name`, { required })}
                onInput={handleInput}
                placeholder="Escreva o nome"
              />

              <div className="position-absolute top-0 end-0 h-100 d-flex align-items-center px-1">
                <Button
                  variant="danger" size="sm"
                  title="Click to remove this input" type="button" tabIndex={-1}
                  onClick={() => remove(i)}
                >
                  &times;
                </Button>
              </div>
            </div>

            {errors?.name?.length > 0 && errors?.name[i] && <span>{errors.name[i].message}</span>}
          </Form.Group>
        )
      })}

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}

export default FormName

