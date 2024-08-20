import {z} from 'zod'

export const usernameValidation = z 
 .string()
 .min(2,"username must be atleast 2 characters")
 .max(20, "username must not be more than 20 chracters")
 .regex(/^[a-zA-Z0-9]+$/,"username must not contain special characters")


 export const signupSchema = z.object({
    username: usernameValidation,
    email:z.string().email({message : "Invalid Email Address"}),
    password: z.string().min(6,"Password must be at least 6 characters")
    
 })