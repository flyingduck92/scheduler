import z from 'zod'
import { passwordSchema } from './passwordSchema'

export const passwordMatchSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string()
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        path: ['passwordConfirm'],
        message: 'Password does not match'
      })
    }
  })