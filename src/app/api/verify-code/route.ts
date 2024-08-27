import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { verifySchema } from "@/schemas/verifySchema";
import { z } from "zod";


export async function POST(request: Request) {
    await dbConnect()
    try {

        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const decodedCode = decodeURIComponent(code)
         
        const ValidatedCode = z.object({
            code : verifySchema
        })
        // Zod validation for code 
        try {
            ValidatedCode.parse({ code: decodedCode });
        } catch (validationError) {
            return new Response(JSON.stringify({
                success: false,
                message: "Invalid Code Format"
            }), {
                status: 400
            });
        }

    
        // Finding User in Database 
        const user = await UserModel.findOne({ username: decodedUsername })
       

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"

            },
                {
                    status: 400
                })
        }

        const isValidCode = user.verifyCode == code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isValidCode && isCodeNotExpired) {
            user.isVerified = true;
            await user.save()
        

        return Response.json({
            success: true,
            message: "Account Verified Successfully"
        },
         {
            status : 200
         }
         )
        }
         else if (!isCodeNotExpired) {
              return Response.json({
                  success : false,
                  message : "Code in Expired"
              },
               {
                status : 400
               })
         }

         else {
            return Response.json({
                success : false,
                message : "Incorrect Verification Code"
            },
         {
            status : 400
         })
         }
         
    } catch (error) {
        console.log("Error Verifying User", error)
        return Response.json(
            {
                success: false,
                message: "Error Verifying User"
            },
            {
                status: 500
            }
        )
    }

}