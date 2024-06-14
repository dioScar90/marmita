import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
// import Button from 'react-bootstrap/Button'
// import Form from 'react-bootstrap/Form'
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
// import Tooltip from 'react-bootstrap/Tooltip'
import { useFieldArray, useForm } from 'react-hook-form'
import watchController from '../../lib/watchController'
import { phoneNumbersSchema } from '../../lib/zodSchemas'




import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"



const FormPhone = () => {
  const form = useForm({
    resolver: zodResolver(phoneNumbersSchema),
    defaultValues: { phoneNumbers: [{ phone: '' }] }
  })
  // const { register, control, handleSubmit, clearErrors, getValues, setValue, setFocus, watch, formState: { errors } } = form
  const { control, clearErrors, getValues, setValue, setFocus, watch } = form
  const { fields, append, remove } = useFieldArray({ control, name: 'phoneNumbers' })
  const phoneWatcher = watchController({ append, remove, getValues, setValue, setFocus, clearErrors })

  // const renderTooltip = (props) => (
  //   <Tooltip id="button-tooltip" {...props}>
  //     Exemplos:
  //     <br />
  //     - (11) <strong>9</strong>&nbsp;5465-1237
  //     <br />
  //     - (11) <strong>3</strong>&nbsp;569-1237
  //   </Tooltip>
  // )
  // const renderTooltip = () => null

  const onSubmit = ({ phoneNumbers }) => {
    console.log('onSubmit')
    if (!phoneNumbers) {
      return
    }

    const okPhones = phoneNumbers.map(({ phone }) => phone?.trim()).filter(phone => typeof phone === 'string' && phone.length > 0)
    console.log('data', okPhones)
  }

  useEffect(() => {
    const subscription = watch(phoneWatcher)
    return () => subscription.unsubscribe()
  }, [watch, phoneWatcher])

  return (
    <>
      <h1>Novo telefone</h1>

      <Form { ...form }>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {fields?.map(({ id }, i) => {
            // const hasMoreThenOneField = fields.length > 1
            // const isLastIndex = i === fields.length - 1
            const name = `phoneNumbers.${i}.phone`

            // return (
            //   <>
            //     <Form.Group className="mb-3 " controlId={field.id} key={field.id}>
            //       {i === 0 && <Form.Label>Phone</Form.Label>}

            //       <div className={hasMoreThenOneField && !isLastIndex ? 'position-relative' : ''}>
            //         <Form.Control
            //           {...register(name)}
            //           type="text" placeholder="Escreva um telefone"
            //           className={'placeholder_input' + (errors.phoneNumbers?.[i]?.phone ? ' border-danger' : '')}
            //         />

            //         {hasMoreThenOneField && !isLastIndex &&
            //           <div className="position-absolute top-0 end-0 h-100 d-flex align-items-center px-2">
            //             <Button
            //               variant="warning" size="sm" type="button" tabIndex={-1}
            //               className="py-0 px-1"
            //               title="Click to remove this input" onClick={() => remove(i)}
            //             >
            //               &times;
            //             </Button>
            //           </div>
            //         }
            //       </div>

            //       {errors.phoneNumbers?.[i]?.phone &&
            //         <OverlayTrigger
            //           placement="right"
            //           delay={{ show: 250, hide: 400, width: 500 }}
            //           overlay={renderTooltip}
            //         >
            //           <span className="text-danger">
            //             {errors.phoneNumbers[i].phone.message}
            //           </span>
            //         </OverlayTrigger>
            //       }
            //     </Form.Group>

            //   </>
            // )

            return (
              <FormField
                className="position-absolute top-0 end-0 h-100 d-flex align-items-center px-2"
                key={id}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          })}


          <Button variant="primary" type="submit">
            Cadastrar
          </Button>
        </form>
      </Form>
    </>
  )
}

export default FormPhone
