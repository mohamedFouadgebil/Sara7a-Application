import { EventEmitter } from "node:events";
import { sendMail, subjectEnum } from "../Email/email.utils.js";
import { template } from "../Email/generateHTML.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("confirmEmail" , async(data)=>{
    await sendMail({
        to : data.to,
        html : template(data.otp , data.firstName , subjectEnum.confirmEmail) ,
        subject : subjectEnum.confirmEmail
    }).catch((err)=>{
        console.log(`Error in confirm email , ${err}`);
    })
})

eventEmitter.on("forgetPassword" , async(data)=>{
    await sendMail({
        to : data.to,
        html : template(data.otp , data.firstName , subjectEnum.confirmEmail) ,
        subject : subjectEnum.resetPassword
    }).catch((err)=>{
        console.log(`Error in confirm email , ${err}`);
    })
})

eventEmitter.on("verifyAccount" , async(data)=>{
    await sendMail({
        to : data.to,
        html : template(data.otp , data.firstName , subjectEnum.verifyAccount) ,
        subject : subjectEnum.verifyAccount
    }).catch((err)=>{
        console.log(`Error in confirm email , ${err}`);
    })
})