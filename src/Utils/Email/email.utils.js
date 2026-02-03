import nodemailer from "nodemailer";

export async function sendMail({
    to = "",
    subject = "", 
    text = "", 
    html = "",
    cc = "",
    bcc = "",
    attachments = []
}){
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
        tls : {
            rejectUnauthorized : false
        }
        });
    
    const info = await transporter.sendMail({
        from: '"Sara7a Application" <mohamed.foouad987@gmail.com>',
        to,
        subject,
        text,
        html,
        cc,
        bcc,
        attachments
    });
}

export const subjectEnum = {
    confirmEmail : "Confirm Your Email",
    resetPassword : "Reset Your Password",
    welcomeMessage : "Welcome in application",
    verifyAccount : "Verify Your Account"
}