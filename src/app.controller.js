import connectionDB from "./DB/connection.js"
import { globalError } from "./Utils/error.handler.utils.js"
import authRouter from "./Modules/Auth/auth.controller.js"
import userRouter from "./Modules/User/user.controller.js"
import messageRouter from "./Modules/Message/message.controller.js"
import cors from "cors"
import path from "node:path"
import { attachmentWithLogger } from "./Utils/Logger/logger.utils.js"
import morgan from "morgan"
import helmet from "helmet"
import { corsOptions } from "./Utils/Cors/cors.utils.js"
import {rateLimit} from "express-rate-limit"

export const bootstrap = async(app , express)=>{
    app.use(express.json({limit : "1kb"}))
    app.use(cors(corsOptions()))
    app.use(helmet())
    const limiter = rateLimit({
        limit : 5 ,
        windowMs : 5*60*1000,
        message : {
            statusCode : 429,
            message : "Too many requestes , Try again later"
        },
        legacyHeaders : false
    })
    app.use(limiter)
    await connectionDB()

    attachmentWithLogger(app ,"/api/v1/auth" , authRouter , "auth.log" )
    attachmentWithLogger(app ,"/api/v1/user" , userRouter , "user.log" )
    attachmentWithLogger(app ,"/api/v1/message" , messageRouter , "message.log" )

    app.use("/Upload" , express.static(path.resolve("./src/Upload")))
    app.use("/api/v1/auth" , authRouter);
    app.use("/api/v1/user" , userRouter);
    app.use("/api/v1/message" , messageRouter);

    app.all("/*dummy" , (req,res,next)=>{
        return res
        .status(404)
        .json({
            message : "Page Not Found"
        })
    })

    app.use(globalError)
}