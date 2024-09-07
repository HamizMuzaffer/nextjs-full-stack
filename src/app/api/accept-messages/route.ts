import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
              
    if (!session || !session.user) {
        return Response.json({
            status: false,
            messsage: "Not Authenticated"
        },
            { status: 401 }
        )
    }

    const userId = user._id;
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
        )

        await updatedUser?.save()

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            },
                {
                    status: 401
                })
        }

        return Response.json({
            success: true,
            message: "User status to accepting messages updated sucessfully"
        },
            {
                status: 201
            })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to updated user status to accept messages"
        },
            {
                status: 500
            })


    }
}

export async function GET(request : Request){
    await dbConnect()
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            status: false,
            messsage: "Not Authenticated"
        },
            { status: 401 }
        )
    }

    const userId = user._id;
    const foundUser = await UserModel.findById(userId)

    try {
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "Failed to found user"
            },
                {
                    status: 404
                })
        }
        return Response.json({
            success : true,
            acceptingMessage : foundUser.isAcceptingMessage
        },
        {
            status : 200
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to Found user server error"
        },
            {
                status: 500
            })

    }
}