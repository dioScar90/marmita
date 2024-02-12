import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useFieldArray, useForm } from 'react-hook-form'


const FormName = () => {
  console.log('render')
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      names: [{name: 'name.0'},{name: 'name.1'},{name: 'name.2'}]
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'names'
  })

  useEffect(() => {
    console.log('watch', watch('name'))
  }, [watch])

  // const initialState = [nanoid()]
  // const [ nameInputs, setNameInputs ] = useState(initialState)
  
  // useEffect(() => {
  //   const watchNames = watch('name')
  //   console.log('watchNames', watchNames)

  //   if (!watchNames) {
  //     return
  //   }
    
  //   const keysFromEmptyValues = Object.entries(watchNames)
  //     .filter(([_, value]) => value?.trim() === '')
  //     .map(([key]) => key)
    
  //   // if (keysFromEmptyValues.length === 0) {
  //   //   return
  //   // }

  //   console.log('keysFromEmptyValues', keysFromEmptyValues)
    
  //   const mustCreateNewId = watchNames[nameInputs.at(-1)].trim().length > 0

  //   const getIdsWithoutEmptyValues = (prev) => prev.filter(id => !id.includes(keysFromEmptyValues))
  //   const getNewId = () => mustCreateNewId ? [nanoid()] : []

  //   const newNameInputs = [ ...getIdsWithoutEmptyValues(nameInputs), getNewId() ]
    
  //   console.log('nameInputs', nameInputs)
  //   console.log('newNameInputs', newNameInputs)

  //   const arraysAreEqual = nameInputs.length === newNameInputs.length && nameInputs.every(item => item.some(newNameInputs))

  //   if (arraysAreEqual) {
  //     return
  //   }
    
  //   setNameInputs(() => newNameInputs)
  // }, [watch])

  // useEffect(() => {
  //   //
  // }, [nameInputs])

  // setTimeout(() => setNameInputs(prev => [...prev, nanoid()]), 2000)

  const handleChange = (e) => {
    const value = e.target.value
    const name = e.target.name

    if (fields.at(-1).id === fields.find(({ name }) === name))
    console.log('value', value)
    console.log('name', name)
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
                {...register(field.name, { required })}
                onChange={handleChange}
                placeholder="Escreva o nome"
              />

              <Button
                variant="danger" size="sm" className="position-absolute top-0 end-0 my-1"
                title="Click to remove this input" type="button"
                onClick={() => remove(i)}
              >
                &times;
              </Button>
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

