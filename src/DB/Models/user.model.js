import mongoose, { Schema } from "mongoose";

export const genderEnum = {
    MALE : "MALE",
    FEMALE : "FEMALE"
}

export const providerEnum = {
    SYSTEM : "SYSTEM",
    GOOGGLE : "GOOGGLE"
}

export const roleEnum = {
    USER : "USER",
    ADMIN : "ADMIN"
}

export const userSchema = new mongoose.Schema(
    {
        firstName : {
            type : String,
            required : true,
            trim : true,
            minLength : [2 , "First Name must be at least 2 characters"],
            maxLength : [20 , "First Name must be at most 20 characters"],
        },
        lastName : {
            type : String,
            required : true,
            trim : true,
            minLength : [2 , "Last Name must be at least 2 characters"],
            maxLength : [20 , "Last Name must be at most 20 characters"],
        },
        email : {
            type : String,
            required : true,
            trim : true,
            unique : true,
            lowercase : true,
        },
        password : {
            type : String,
            required : function(){
                return providerEnum.GOOGGLE ? false : true
            },
            minLength : [8 , "Password must be at least 8 characters"]
        },
        phone : {
            type : String,
        },
        age : {
            type : Number
        },
        gender : {
            type : String,
            required : true,
            enum : {values : Object.values(genderEnum) , message : "{VALUE} is not supported"},
            default : genderEnum.MALE
        },
        profileImage:{
            type : String
        },
        coverImages : {
            type : [String]
        },
        profileImageCloud:{
            public_id : String,
            secure_url : String
        },
        coverImagesCloud : [{
            public_id : String,
            secure_url : String
        }],
        confirmEmail : {
            type : Date
        },
        confirmEmailOTP : {
            type : String
        },
        forgetPasswordOTP :{
            type : String
        },
        providers : {
            type : String,
            enum : ({values : Object.values(providerEnum) , message : `{VALUE} isn't supported`}),
            default : providerEnum.SYSTEM,
        },
        freezedAt : Date,
        freezedBy : {
            type : mongoose.Schema.Types.ObjectId
        },
        restoredAt : Date,
        restoredBy : {
            type : mongoose.Schema.Types.ObjectId
        },
        role : {
            type : String,
            enum : ({values : Object.values(roleEnum) , message : `{VALUE} is not supported`}),
            default : roleEnum.USER,
            required : true
        },
        verifyAccountOTP : String
    }
    ,
    {
        timestamps : true,
        toJSON : {virtuals : true},
        toObject : {virtuals : true}
    }
)

userSchema.virtual("messages" , {
    localField : "_id" ,
    foreignField : "receiverId" ,
    ref : "Message"
})

const userModel = mongoose.models.User || mongoose.model("User" , userSchema)
export default userModel;