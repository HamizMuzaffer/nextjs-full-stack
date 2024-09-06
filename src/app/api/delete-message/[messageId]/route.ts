import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";


export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    const messageId = params.messageId
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

    try {

        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        )

        if (updateResult.modifiedCount == 0) {
            return Response.json({
                sucess: false,
                message: "message not found or already deleted"
            },
                {
                    status: 401
                })
        }
        return Response.json({
            success: true,
            message: "Message deleted sucessfully"
        },
            { status: 200 }
        )
    } catch (error) {
        return Response.json({
            success: false,
            message: "Internal Server error"
        },
            {
                status: 500
            })
    }

}