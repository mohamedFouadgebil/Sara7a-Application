import fs from "node:fs"
import path from "node:path"
import morgan from "morgan"

const __dirname = path.resolve() 

export const attachmentWithLogger = (app , routerPath , router , fileName)=>{
    const logStream = fs.createWriteStream(path.join(__dirname,"/src/logs",fileName), {flags : "a"}) 

    app.use(routerPath , morgan("combined" , {stream : logStream}) , router)
    app.use(routerPath , morgan("dev") , router )
}