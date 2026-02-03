import joi from "joi"
import { genderEnum, roleEnum } from "../DB/Models/user.model.js";
import { Types } from "mongoose";

export const validation = (schema) => {
    return (req, res, next) => {
        const validationError = [];
        for (const key of Object.keys(schema)) {
            const validationResult = schema[key].validate(req[key], {
                abortEarly: false,
        });
        if (validationResult.error){
            validationError.push({ key, details: validationResult.error.details });
        }}
        if (validationError.length)
            return res
                .status(400)
                .json({ message: "Validation Error", details: validationError });
        return next();
    };
};

export const generalField = {
    firstName : joi.string().trim().min(2).max(20),
    lastName : joi.string().trim().min(2).max(500),
    email : joi.string().email({minDomainSegments : 2 , maxDomainSegments : 5 , tlds: ["com","net","io","org"]}),
    password : joi.string().min(8),
    confirmPassword : joi.ref("password"),
    gender : joi.string().valid(...Object.values(genderEnum)).default(genderEnum.MALE),
    phone : joi.string().pattern(/^01[0125][0-9]{8}$/),
    age : joi.number(),
    otp : joi.string().required(),
    role : joi.string().valid(...Object.values(roleEnum)).default(roleEnum.USER) ,
    id : joi.string().custom((value,helper)=>{
            return (Types.ObjectId.isValid(value) || helper.message("Invalid Object id"))
        }),
    file:{
        fieldname : joi.string(),
        originalname : joi.string() ,
        encoding : joi.string() ,
        mimetype : joi.string() ,
        size : joi.number().positive() ,
        destination : joi.string(),
        filename : joi.string(),
        path : joi.string() ,
        finalPath : joi.string(),
    },
    
}