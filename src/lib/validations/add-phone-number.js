import { z } from 'zod'

export const addPhoneNumberValidator = z.object({
  email: z.string().email(),
})
