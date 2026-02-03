import joi from "joi";
import { generalField } from "../../Middleware/validation.middleware.js";

export const signupSchema = {
    body : joi.object({
    firstName : generalField.firstName.required(),
    lastName : generalField.lastName.required(),
    email : generalField.email.required(),
    password : generalField.password.required(),
    confirmPassword : generalField.confirmPassword,
    gender : generalField.gender.required(),
    phone : generalField.phone.required(),
    age : generalField.age,
    role : generalField.role.required()
})
}

export const loginSchema = {
    body : joi.object({
    email : generalField.email.required(),
    password : generalField.password.required(),
})
}

export const confirmEmailSchema = {
    body : joi.object({
    email : generalField.email.required(),
    otp : generalField.otp.required(),
})
}

export const forgetPasswordSchema = {
    body : joi.object({
    email : generalField.email.required(),
})
}

export const resetPasswordSchema = {
    body : joi.object({
    email : generalField.email.required(),
    otp : generalField.otp.required(),
    password : generalField.password.required(),
    confirmPassword : generalField.confirmPassword,
})
}