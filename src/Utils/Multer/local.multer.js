import multer  from "multer"
import path from "node:path"
import fs from "node:fs"

export const fileValidation = {
    images: ["image/ief" , "image/jpeg" , "image/png" , "image/jpg" , "image/webp"],
    audio: ["audio/aiff" , "audio/mp4" , "audio/mpeg"],
    videao: ["video/jpeg" , "video/jpm" , "video/mp4"],
    document: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document" , "application/vnd.openxmlformats-officedocument.wordprocessingml.template"]
}

export const localUploadFile = ({customPath = "general" , validation = []})=>{
    const basePath = `Upload/${customPath}`
    const storage = multer.diskStorage({
        destination : (req,file,cb)=>{
            let userBasePath = basePath;
            if(req.user?._id) userBasePath += `/${req.user._id}`
            const fullPath = path.resolve(`./src/${userBasePath}`)
            if(!fs.existsSync(fullPath)) fs.mkdirSync(fullPath , {recursive : true})
            cb(null , fullPath)
        },

        filename : (req,file,cb)=>{
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + file.originalname
            file.finalPath = `${basePath}/${req.user._id}/${uniqueSuffix}`
            cb(null , uniqueSuffix)
        }
    })
    
    const fileFilter = (req,file,cb)=>{
        if(validation.includes(file.mimetype)){
            cb(null , true)
        }
        else{
            cb(new Error("Invalid Type File" , false))
        }
    }

    return multer({fileFilter , storage})
}
