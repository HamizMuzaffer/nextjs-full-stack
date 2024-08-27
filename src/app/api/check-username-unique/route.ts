import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signupSchema";
import { log } from "console";
import { Urbanist } from "next/font/google";
import { z } from "zod";


const queryUsernameSchema = z.object({
    username: usernameValidation
})


export async function GET(request: Request) {

    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // Validation with zod for username

        const result = queryUsernameSchema.safeParse(queryParam)
        if (!result.success) {
            const userNameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: userNameErrors?.length > 0 ? userNameErrors.join(", ") : "Invalid Query Parameters"
            },
                {
                    status: 400
                }
            )
        }
        // checking if user exists in database 
        const username = result.data.username
        const existingVerifiedUsername = await UserModel.findOne({
            username: username,
            isVerified: true
        })


        if (existingVerifiedUsername) {
            return Response.json({
                status: false,
                message: 'Username is already taken',

            },
                {
                    status: 400
                })
        }
        // if user is not in database
        return Response.json({
            status: true,
            message: "username is unique"
        },
            {
                status: 200
            })
    } catch (error) {
        console.log("error checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error Checking Username"

            },
            {
                status: 500
            }
        )
    }

}