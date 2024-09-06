import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request) {
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

    const userId = new mongoose.Types.ObjectId(user._id);
    // mongodb aggregation for finding messages for specific and grouping it
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "_id", messages: { $push: "$messages" } } }

        ])
          console.log("found user", user)
        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found",

            },
                {
                    status: 401
                })
        }

         console.log("messages:",user[0].messages)
        return Response.json({
            success: true,
            messages: user[0].messages
        },
            {
                status: 200
            })
    } catch (error) {
        console.log('An unexpected error occurred', error)
        return Response.json({
            status: false,
            messsage: "Internal Server Error"
        },
            { status: 500 }
        )
    }
}