import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs"
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {

                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error("No user found")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (isPasswordCorrect) {
                        return user;
                    }
                    else {
                        throw new Error("Incorrect Password")

                    }

                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks :{
        async jwt({ token, user}) {
            if(user){
                token._id =  user._id?.toString()
                token.isVerified = user?.isVerified
                token.username = user?.username
                token.isAcceptingMessage = user?.isAcceptingMessage             
            }
            return token
          },
        async session({ session,token }) {
            
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            return session
          }         
    },
    pages:{
        signIn : '/sign-in',
    },
    session: {
          strategy : "jwt"
    },
    secret : process.env.NEXT_AUTH_SECRET_KEY
    

    

    

}