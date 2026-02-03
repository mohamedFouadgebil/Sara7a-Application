import { request } from "express";
import mongoose , {Schema} from "mongoose";

export const messageSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : true,
            minLength : [2 , "Title must be at least 2 character"],
            maxLength : [20 , "Title must be at most 20 character"]
        },
        content : {
            type : String,
            required : true,
            minLength : [2 , "Content must be at least 2 character"],
            maxLength : [500 , "Content must be at most 500 character"]
        },
        receiverId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "User"
        },
    } , 
    {
        timestamps : true
    }
)

const messageModel = mongoose.models.Message || mongoose.model("Message" , messageSchema);
export default messageModel;