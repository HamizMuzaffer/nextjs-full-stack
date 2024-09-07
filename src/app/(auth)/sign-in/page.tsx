"use client"

import React, { useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from 'next/link'
import * as z from "zod"
import { useToast } from "../../../hooks/use-toast"
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
const Page = () => {
  // states initialization 
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // zod implementation 
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })



  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setLoading(true)
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    console.log(result)
    if (result?.error) { 
      toast({
        title: "login failed",
        description: "Incorrect username or password",
        variant: "destructive"
      })
      setLoading(false)
    }
    if(result?.url){
      router.replace("/user-dashboard")
    }
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Join Mystery Message</h1>
          <p className='mb-4'>Sign in to start your anonymous adventure</p>
        </div>
        <Form  {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 '>
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email or username" {...field} required/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field}
                      type='password' required/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-col justify-center items-center'>
              <Button type='submit' className='px-4' >
                {
                  loading ? (
                    <>
                   <div className='flex justify-center items-center'>
                    <Loader2  className='animate-spin w-2 h-2 mx-4'/>
                   </div>
                   </>
                  ) : 
                  (
                    <>
                    <span>Login</span>
                    </>
                  )
                }
              </Button>
            </div>
          </form>
        </Form>
        <div className='text-center mt-4 '>
          <p className='mr-2'>Doesn&apos;t have an account?{"  "}
            <Link href="/sign-up" className='text-blue-600 hover:text-blue-800'>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page