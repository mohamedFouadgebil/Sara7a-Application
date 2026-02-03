import { generateToken, getLoginCrediantels, verifyToken } from "../../Utils/Tokens/token.utils.js";
import { successResponse } from "../../Utils/successResponse.utils.js";
import { eventEmitter } from "../../Utils/Event/email.event.utils.js";
import { encrypt } from "../../Utils/Encryption/encryption.utils.js";
import { compare, hash } from "../../Utils/Hash/hash.utils.js";
import { customAlphabet } from "nanoid";
import { v4 as uuid} from "uuid"
import tokenModel from "../../DB/Models/token.model.js";
import userModel, { providerEnum } from "../../DB/Models/user.model.js";
import * as dbServices from "../../DB/dbServices.js"
import { OAuth2Client } from 'google-auth-library';

export const signup = async(req,res,next)=>{
    const {firstName , lastName , email , password , phone , age , gender} = req.body;

    const checkUser = await dbServices.findOne({
        model : userModel,
        filter : {email},
    })

    if(checkUser)
        return res.status(200).json({message : "User already exists"})

    const otp = customAlphabet("01478523699874563210258426810058745897412569841" , 6)()

    const user = await dbServices.create({
        model : userModel,
        data : [{
            firstName , 
            lastName , 
            email , 
            password : await hash({plaintext : password}) , 
            phone : await encrypt(phone) , 
            age , 
            gender ,
            confirmEmailOTP : await hash({plaintext : otp}) 
        }]
    })

    eventEmitter.emit("confirmEmail" , {to : email , otp , firstName})

    return successResponse({
        res,
        status : 201,
        message : "User Created Successfully",
        data : {user}
    })
}

export const login = async(req,res,next)=>{
    const {email , password} = req.body;

    const checkUser = await dbServices.findOne({
        model : userModel,
        filter : {email , confirmEmail : {$exists : true}}
    })

    if(!checkUser)
        return res.status(404).json({message : "User Not Found or email not confirmed"})

    if(!(await compare({plaintext : password , hash : checkUser.password})))
        return res.status(404).json({message : "Password Not Match"})

    const crediantels = await getLoginCrediantels(checkUser)
    return successResponse({
        res,
        status : 200,
        message : "Login Successfully",
        data : {crediantels}
    })
}

export const confirmEmail = async(req,res,next)=>{
    const {email , otp} = req.body;

    const checkUser = await dbServices.findOne({
        model : userModel,
        filter : {email , confirmEmailOTP : {$exists : true},confirmEmail : {$exists : false}}
    })

    if(!checkUser)
        return res.status(400).json({message : "User not found"})

    if(!(await compare({plaintext : otp , hash : checkUser.confirmEmailOTP})))
        return res.status(400).json({message : "Invalid OTP"})

    await dbServices.findOneAndUpdate({
        model : userModel,
        filter : {email , confirmEmailOTP : {$exists : true}},
        data : {
            $unset : {confirmEmailOTP : true},
            confirmEmail : Date.now(),
            $inc : {__v : 1} 
        }
    })

    return successResponse({
        res,
        status : 200,
        message : "Email Confirmed Successfully"
    })
}

export const logout = async(req , res , next)=>{
    await dbServices.create({
        model : tokenModel,
        data : [{
            jwtid : req.decoded.jti , 
            expireIn : new Date(req.decoded.exp * 1000),
            userId : req.user._id
        }]
    })

    return successResponse({
        res,
        status : 200 ,
        message : {message : "Logout Done Successfully"}
    })
}

export const refreashToken = async(req , res , next)=>{
    const user = req.user;

    const crediantels = await getLoginCrediantels(user)

    return successResponse({
        res,
        status : 200 ,
        message : {message : "Token Refreashed Successfully"},
        data : {crediantels}
    })
}

export const updatePassword = async(req , res , next)=>{
    const {email , password , newPassword , confirmPassword} = req.body;

    const user = await dbServices.findOne({
        model : userModel,
        filter : {email}
    })

    if(!user)
        return next(new Error("Invalid Data" , {cause : 400}))

    if(!await compare({plaintext : password , hash : user.password })){
        return next(new Error("Invalid Password" , {cause : 400}))
    }

    if(!(newPassword === confirmPassword))
        return next(new Error("Password Not Match" , {cause : 400}))

    await dbServices.updateOne({
        model : userModel,
        filter : {email},
        data : {
            password : await hash({plaintext : newPassword}),
            $inc : {__v : 1},
        }
    })

    return successResponse({
        res,
        status : 200 ,
        message : {message : "Password Updated Successfully"},
    })
}

export const forgetPassword = async(req , res , next)=>{
    const {email} = req.body;

    const otp = customAlphabet("01234567899151853684538485684856315845876543210187451258" , 6)();

    const user = await dbServices.findOneAndUpdate({
        model : userModel , 
        filter : {email , confirmEmail : {$exists : true}},
        data : {
            forgetPasswordOTP : await hash({plaintext : otp})
        }
    })

    if(!user)
        return next(new Error("Invalid User" , {cause : 400}))

    eventEmitter.emit("forgetPassword" , {to : email , firstName : user.firstName , otp })
    
    return successResponse({
        res,
        status : 200 ,
        message : {message : "Check Your Box"},
    })
}

export const resetPassword = async(req,res,next)=>{
    const {email , otp , password} = req.body;

    const checkUser = await dbServices.findOne({
        model : userModel,
        filter : {email , confirmEmail : {$exists : true}}
    })

    if(!checkUser)
        return next(new Error("User Not Found" , {cause : 400}))

    const checkOtp = await compare({
        plaintext : otp,
        hash : checkUser.forgetPasswordOTP
    })

    if(!checkOtp)
        return next(new Error("Invalid Otp" , {cause : 400}))

    const user = await dbServices.updateOne({
        model : userModel,
        filter : {
            email ,
            forgetPasswordOTP : {$exists : true},
        },
        data : {
            $unset : {forgetPasswordOTP : true},
            $inc : {__v : 1}, 
            password : await hash({plaintext : password})
        }
    })

    return successResponse({
        res,
        status : 200 ,
        message : {message : "Password Updated Successfully"},
    })
}

async function verifyGoogleAccount({idToken}){
    const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID,
        });
    const payload = ticket.getPayload()
    return payload
}

export const loginWithGoogle = async(req,res,next)=>{
    const {idToken} = req.body;
    
    const {email,email_verified,given_name,family_name} = await verifyGoogleAccount({idToken})
        
    if(!email_verified)
            return next(new Error("Email not verified" , {cause : 401}))

    const user = await dbServices.findOne({
        model : userModel,
        filter : {email}
    })

    if(user){
        if(user.providers === providerEnum.GOOGGLE){
            const crediantels = await getLoginCrediantels(checkUser)

            return successResponse({
                res,
                message : {message : "Done"},
                data : {crediantels}
            })
        }
    }
    else{
        await dbServices.create({
            model : userModel,
            data : [{
                firstName : given_name,
                lastName : family_name,
                email,
                confirmEmail : Date.now(),
                providers : providerEnum.GOOGGLE
            }]
        })
    }

    const crediantels = await getLoginCrediantels(checkUser)

    return successResponse({
        res,
        status : 200 ,
        message : {message : "Login Successfully With Google"},
        data : {crediantels}
    })
}

