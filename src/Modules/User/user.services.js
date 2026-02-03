import { successResponse } from "../../Utils/successResponse.utils.js";
import { verifyToken } from "../../Utils/Tokens/token.utils.js";
import * as dbServices from "../../DB/dbServices.js" 
import userModel, { roleEnum } from "../../DB/Models/user.model.js";
import tokenModel from "../../DB/Models/token.model.js";
import { cloudinaryConfig } from "../../Utils/Multer/cloudinary.config.js";
import { customAlphabet, nanoid } from "nanoid";
import { eventEmitter } from "../../Utils/Event/email.event.utils.js";
import { compare, hash } from "../../Utils/Hash/hash.utils.js";

export const updateUser = async(req,res,next)=>{
    const {firstName , lastName , phone} = req.body;

    const user = await dbServices.findByIdAndUpdate({
        model : userModel,
        id :  req.decoded.id,
        data : {firstName , lastName , phone , $inc : {__v : 1}}
    })

    return successResponse({
        res,
        status : 200,
        message : "User Updated Successfully",
        data : {user}
    })
}

export const listUser = async(req,res,next)=>{
    const user = await dbServices.find({
        model : userModel,
        populate : [{path : "messages" , select : "-_id -receiverId content"}]
    })

    return successResponse({
        res,
        status : 200,
        message : "User Updated Successfully",
        data : {user}
    })   
}

export const profileImage = async(req,res,next)=>{
    const user = await dbServices.findOneAndUpdate({
        model : userModel,
        filter : {
            _id : req.user._id
        },
        data :{
            profileImage : req.file.finalPath
        }
    })

    return successResponse({
        res,
        status : 200,
        message : "Image Uploaded Successfully",
        data : {user}
    })
}

export const profileImageCloud = async(req,res,next)=>{
    const {public_id , secure_url} = await cloudinaryConfig().uploader.upload(req.file.path,{
        folder : `/Sara7aApp/Users/${req.user._id}`,
    })

    const user = await dbServices.findOneAndUpdate({
        model : userModel,
        filter : {_id : req.user._id},
        data : {
            profileImageCloud : {
                public_id , secure_url
            }
        }
    })

    if(req.user.profileImageCloud?.public_id){
        await cloudinaryConfig().uploader.destroy(req.user.profileImageCloud.public_id)
    }

    return successResponse({
        res,
        status : 200,
        message : "Image Uploaded Successfully",
        data : {user}
    })
}

export const coverImages = async(req,res,next)=>{
    const user = await dbServices.findOneAndUpdate({
        model : userModel,
        filter : {_id :  req.user._id},
        data : {
            coverImages : req.files.map((file)=> file.finalPath)
        }
    })

    return successResponse({
        res,
        status : 200,
        message : "Images Uploaded Successfully",
        data : {user}
    })
}

export const coverImagesCloud = async(req,res,next)=>{
    const attachement = []

    for (const file of req.files) {
        const {public_id , secure_url} = await cloudinaryConfig().uploader.upload(file.path , {
            folder : `Sara7aApp/Users/${req.user._id}`
        })
    
        attachement.push({public_id , secure_url})
    }

    const user = await dbServices.findOneAndUpdate({
        model : userModel , 
        filter : {_id : req.user._id},
        data : { coverImagesCloud : attachement }
    })

    return successResponse({
        res,
        status : 200,
        message : "Cover Images Uploaded Successfully",
        data : {user}
    })
}

export const freezedAccount = async(req,res,next)=>{
    const {userId} = req.params;

    if(userId && req.user.role !== roleEnum.ADMIN)
        return next(new Error("You Not Have Authorization To Freeze Account" ,{cause : 400}))

    const user = await dbServices.findOneAndUpdate({
        model : userModel,
        filter :{
            _id : userId || req.user._id,
            freezedAt : {$exists : false}
        },
        data : {
            freezedAt : Date.now(),
            freezedBy : req.user._id,
            $inc : {__v : 1}
        }
    })

    if(!user)
        return next(new Error("User Not Found To Freezed" , {cause : 400}))

    return successResponse({
        res,
        status : 201,
        message : {message : "Account Freezed Successfully"},
        data : {user}
    })
}

export const restoredAccount = async(req,res,next)=>{
    const {userId} = req.params;

    const user = await dbServices.findOneAndUpdate({
        model : userModel,
        filter :{
            _id : userId,
            freezedAt : {$exists : true},
            freezedBy : {$exists : true}
        },
        data : {
            $unset : {
                freezedAt : {$exists : true},
                freezedBy : {$exists : true}
            },
            restoredAt : Date.now(),
            restoredBy : req.user._id,
            $inc : {__v : 1}
        }
    })

    if(!user)
        return next(new Error("User Not Found To Restored" , {cause : 400}))

    return successResponse({
        res,
        status : 201,
        message : {message : "Account Restored Successfully"},
        data : {user}
    })
}

export const checkAccount = async(req,res,next)=>{
    const {email} = req.body

    const checkUser = await dbServices.findOne({
        model : userModel,
        filter : {email}
    })
    if(!checkUser)
        return next(new Error("Invalid email or account not confirmed" , {cause : 400}))

    const otp = customAlphabet("9298392085904148451843098549198481068" , 6)();

    eventEmitter.emit("verifyAccount" , {to : email , firstName : checkUser.firstName ,otp})
    
    const user = await dbServices.findOneAndUpdate({
        model : userModel,
        filter : {
            email , confirmEmail : {$exists : true}
        },
        data : {
            verifyAccountOTP : await hash({plaintext : otp}),
        }
    })

    return successResponse({
        res,
        status : 200,
        data : {user}
    })
}

export const verifyAccount = async(req,res,next)=>{
    const {email , otp , password} = req.body

    const checkUser = await dbServices.findOne({
        model : userModel,
        filter : {email , confirmEmail : {$exists : true}}
    })
    if(!checkUser)
        return next(new Error("Invalid email or account not confirmed" , {cause : 400}))
    
    if(!await compare({plaintext : otp , hash : checkUser.verifyAccountOTP}))
        return next(new Error("Invalid OTP" , {cause : 400}))
    
    if(!await compare({plaintext : password , hash : checkUser.password}))
        return next(new Error("Invalid Password" , {cause : 400}))

    const user = await dbServices.findOneAndUpdate({
        model : userModel,
        filter : {email , confirmEmail : {$exists : true}},
        data : {
            $unset : {verifyAccountOTP : true},
            $inc : {__v: 1}
        }
    })

    return successResponse({
        res,
        status : 200,
        data : {user}
    })
}