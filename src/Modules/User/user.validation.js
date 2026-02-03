import joi from "joi";
import { generalField } from "../../Middleware/validation.middleware.js";
import { fileValidation } from "../../Utils/Multer/local.multer.js";

export const profileImageSchema = {
  file: joi
    .object({
      fieldname: generalField.file.fieldname.valid("profileImage").required(),
      originalname: generalField.file.originalname.required(),
      encoding: generalField.file.encoding.required(),
      mimetype: generalField.file.mimetype
        .valid(...fileValidation.images)
        .required(),
      size: generalField.file.size.max(5 * 1024 * 1024).required(),
      destination: generalField.file.destination.required(),
      filename: generalField.file.filename.required(),
      path: generalField.file.path.required(),
      finalPath: generalField.file.finalPath.required(),
    })
    .required(),
};

export const coverImageSchema = {
  files: joi
    .object({
      fieldname: generalField.file.fieldname.valid("coverImages").required(),
      originalname: generalField.file.originalname.required(),
      encoding: generalField.file.encoding.required(),
      mimetype: generalField.file.mimetype
        .valid(...fileValidation.images)
        .required(),
      size: generalField.file.size.max(5 * 1024 * 1024).required(),
      destination: generalField.file.destination.required(),
      filename: generalField.file.filename.required(),
      path: generalField.file.path.required(),
      finalPath: generalField.file.finalPath.required(),
    })
    .required(),
};

export const freezedUserSchema = {
  params : joi.object({
  userId : generalField.id
})}

export const restoreUserSchema = {
  params : joi.object({
  userId : generalField.id.required()
})}

export const checkAccountSchema = {
  body : 
    joi.object({
      email : generalField.email.required()
    })
}

export const verifyAccountSchema = {
  body : 
    joi.object({
      email : generalField.email.required(),
      password : generalField.password.required(),
      otp : generalField.otp.required()
    })
}
