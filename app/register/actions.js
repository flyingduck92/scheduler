'use server'

import db from '@/db/drizzle'
import { hash } from 'bcryptjs'
import { passwordMatchSchema } from '@/validation/passwordMatchSchema'
import z from 'zod'
import { users } from '@/db/usersSchema'
import { profiles } from '@/db/profilesSchema'

const registerUser = async ({ email, password, passwordConfirm }) => {

  const newUserSchema = z
    .object({
      email: z.email()
    }).and(passwordMatchSchema)

  const newUserValidation = newUserSchema.safeParse({ email, password, passwordConfirm })

  if (!newUserValidation.success) {
    return {
      error: true,
      message: newUserValidation.error.issues[0]?.message ?? 'An error occured'
    }
  }

  // do hash the password
  const saltRound = 10
  const hashedpassword = await hash(password, saltRound)

  let profile
  try {
    // create profile first then insert to profile.id to newUser
    [profile] = await db
      .insert(profiles)
      .values({
        username: '',
        fullname: ''
      })
      .returning({ id: profiles.id })

    // then insert profile.id to new_user
    const [user] = await db
      .insert(users)
      .values({
        email,
        password: hashedpassword,
        ProfileId: profile.id
      })
      .returning()

    return { ...user }

  } catch (err) {
    // rollback orphan profile if user creation failed
    if (profile?.id) {
      await db.delete(profiles).where(eq(profiles.id, profile.id))
    }

    // if found duplication
    if (err?.caused?.code === '23505') {
      return {
        error: true,
        message: 'An account is already registered'
      }
    }

    return {
      error: true,
      message: 'An error occured'
    }
  }

}

export default registerUser