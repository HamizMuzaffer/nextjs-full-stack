import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";



export async function POST(request : Request){
    dbConnect()
    // getting message from user 
    const {username,content} = await request.json()

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                status: false,
                messsage: "User not found"
            },
                { status: 401 }
            )
        }

        // Checking if user is accepting the messages

        if(!user.isAcceptingMessage){
            return Response.json({
                success : false,
                message : "User is not accepting messages",

            },
             {
                status : 403
             })
        }

        // adding the message in existing user array
        const newMessage = { content, createdAt : new Date }
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json({
            status: true,
            messsage: "Message sent successfully"
        },
            { status: 200 }
        )
    } catch (error) {
        console.log("Error Sending message: ",error)
        return Response.json({
            status: false,
            messsage: "Internal Server Error"
        },
            { status: 500 }
        )
    }
 }