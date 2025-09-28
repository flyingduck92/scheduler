'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { passwordMatchSchema } from '@/validation/passwordMatchSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import registerUser from './actions'
import Link from 'next/link'

const registerFormSchema = z
  .object({
    email: z.email(),
  }).and(passwordMatchSchema)

const RegisterPage = () => {

  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    }
  })

  const handleSubmit = async (data) => {
    const response = await registerUser({
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm
    })

    if (response?.error) {
      form.setError('email', {
        message: response?.message
      })
    }

    console.log(response)
  }

  return (
    <main className='flex justify-center items-center min-h-screen'>
      {form.formState.isSubmitSuccessful ? (
        <Card className='w-80'>
          <CardHeader>
            <CardTitle className='text-center'>Your account has been created</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className='w-full'>
              <Link href="/login">
                Login to my account
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className='w-80'>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Register your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <fieldset disabled={form.formState.isSubmitting} className='flex flex-col gap-2'>
                  <FormField control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="your_email@domain.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="******" type='password' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control}
                    name='passwordConfirm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password Confirm</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="******" type='password' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit'>Register</Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </main>
  )
}

export default RegisterPage