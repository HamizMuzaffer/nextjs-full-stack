import mongoose, { Schema, model, Document } from "mongoose";


// Interface for adding Messages 

export interface Message extends Document {
    _id : string
    content: String;
    createdAt: Date,
}

// Mongoose schema for message 

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

// Inteface for adding a user 
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]

}

// Mongoose schema for User 

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use a valid email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify Code Expiry is Required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code Expiry is Required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        defaut: true

    },
    messages: [MessageSchema]

})

// User model declaration 
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema))
export default UserModel;