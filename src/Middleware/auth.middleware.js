import * as dbServices from "../../src/DB/dbServices.js"
import tokenModel from "../DB/Models/token.model.js";
import userModel from "../DB/Models/user.model.js";
import { getSignature, verifyToken } from "../Utils/Tokens/token.utils.js";

export const tokenEnum = {
    ACCESS : "ACCESS",
    REFRESH : "REFRESH"
}

const decodedToken = async({
    authorization , 
    tokenType = tokenEnum.ACCESS , 
    next} = {})=>{

    const [Bearer , token] = authorization.split(" ") || []

    if(!Bearer || !token)
        return next(new Error("Invalid Token" , {cause : 400}))

    let signatures = await getSignature({
        signatureLevel : Bearer
    })

    const decoded = verifyToken({
        token ,
        secretKey : tokenType === tokenEnum.ACCESS 
        ? signatures.accessSignature 
        : signatures.refreshSignature
    })

    if(!decoded.jti)
        return next(new Error("Invalid Token" , {cause : 401}))

    const revokeToken = await dbServices.findOne({
        model : tokenModel,
        filter : {jwtid : decoded.jti}
    })

    if(revokeToken)
        return next(new Error("Token is revoked" , {cause : 401}))

    const user = await dbServices.findById({
        model : userModel,
        id : decoded.id
    })

    if(!user)
        return next(new Error("User not found" , {cause : 404}))

    return {user , decoded}
}

export const authentication = ({tokenType = tokenEnum.ACCESS} = {})=>{
    return async (req,res,next)=>{
        const {user , decoded} = (await decodedToken({
            authorization : req.headers.authorization,
            tokenType,
            next
        })) || {}

        req.user = user
        req.decoded = decoded
        return next()
    }
}

export const authorization = ({accessRole = [] } = {})=>{
    return(req,res,next)=>{
        if(!accessRole.includes(req.user.role)){
            return next(new Error("Unauthorized Access" , {cause :403}))
        }
        return next()
    }
}