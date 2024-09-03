import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// creating api for signup process

export async function POST(request: Request) {
    await dbConnect()

    try {
        // recieving singup data from user request

        const { username, email, password } = await request.json()
        
        // check if user is avalaible and verified with similar name 

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username: username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                error: "User Already Exists"
            })
        }

        // check if user is avalaible and verified with similar email 

        const existingUserByEmail = await UserModel.findOne({ email })

        // generating otp for email verification

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
            
        if (existingUserByEmail) {
            // checking if user is verified 

            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    error: "User Already Exists with this email"
                },
                    {
                        status: 500
                    }
                )
            }
            else {
                // if user is not verified updating a user with same email or username 

                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
            return Response.json({
                success: false,
                error: "Email Already Exist"

            })
        }
        else {
            // if nothing is similar the user still need to be created 

            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
            // Send Verification Email

            const emailResponse = await sendVerificationEmail(
                email,
                username,
                verifyCode
            )

            if (!emailResponse.success) {
                return Response.json({
                    success: false,
                    message: emailResponse.message
                },
                    {
                        status: 500
                    }
                )
            }

            return Response.json({
                success: true,
                message: "User Signed up succesfully. Please verify your email"
            },
                {
                    status: 200
                }
            )
        }


    } catch (error) {
        console.error("Error registering User", error)
        return Response.json({
            success: false,
            message: "error registering user"
        },
            {
                status: 500
            })
    }
}