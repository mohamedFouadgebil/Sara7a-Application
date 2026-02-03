import jwt from "jsonwebtoken"
import {v4 as uuid} from "uuid"

export const signatureEnum = {
    USER : "USER",
    ADMIN : "ADMIN"
}

export const generateToken = ({
    payload , 
    secretKey = process.env.SECRET_TOKEN_ACCESS_TOKEN , 
    options = {expiresIn : process.env.EXPIRE_TIME_ACCESS_TOKEN || "1h"}
})=>{
    return jwt.sign(payload , secretKey , options)
}

export const verifyToken = ({
    token, 
    secretKey = process.env.SECRET_TOKEN_ACCESS_TOKEN
})=>{
    return jwt.verify(token , secretKey)
}

export const getSignature = async({signatureLevel = signatureEnum.USER})=>{
    let signature = {accessSignature : undefined , refreshSignature : undefined}

    switch (signatureLevel) {
        case signatureEnum.ADMIN:
            signature.accessSignature = process.env.SECRET_TOKEN_ADMIN_ACCESS_TOKEN,
            signature.refreshSignature = process.env.SECRET_TOKEN_ADMIN_REFREASH_TOKEN
            break;
        default:
            signature.accessSignature = process.env.SECRET_TOKEN_USER_ACCESS_TOKEN,
            signature.refreshSignature = process.env.SECRET_TOKEN_USER_REFREASH_TOKEN
            break;
    }

    return signature;
}

export const getLoginCrediantels = async(user)=>{
    const signature = await getSignature({
        signatureLevel : user.role != signatureEnum.USER ? signatureEnum.ADMIN : signatureEnum.USER
    })
    const accessToken = generateToken({
        payload : {email : user.email , id : user.id , firstName : user.firstName , role : user.role},
        secretKey : signature.accessSignature,
        options : {
            expiresIn : parseInt(process.env.EXPIRE_TIME_ACCESS_TOKEN),
            jwtid : uuid()
        }
    }
    )

    const refreshToken = generateToken({
        payload : {email : user.email , id : user.id , firstName : user.firstName , role : user.role},
        secretKey : signature.refreshSignature,
        options : {
            expiresIn : parseInt(process.env.EXPIRE_TIME_REFREASH_TOKEN),
            jwtid : uuid()
        }
    }
    )

    return {accessToken , refreshToken}
}