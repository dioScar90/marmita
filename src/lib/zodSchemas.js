import { z } from 'zod'

const emptyString = z.string().length(0, { message: false })

const namesSchema = z.object({
  names: z.array(
    z.object({
      name: z.union([
        emptyString,
        z.string().trim().min(1, { message: 'Sua mãe é toda minha' })
      ])
    })
  )
})

const phoneNumbersSchema = z.object({
  phoneNumbers: z.array(
    z.object({
      phone: z.union([
        emptyString,
        z.string().regex(/^\(\d{2}\) (9\d{4}-\d{4}|3\d{3}-\d{4})$/, 'Informe um número de telefone válido.')
      ])
        .optional()
        .transform(e => e === '' ? undefined : e)
    })
  )
})

export { namesSchema, phoneNumbersSchema }
