import { z } from 'zod'

export const addCustomerValidator = z.object({
  email: z.string().email(),
})
