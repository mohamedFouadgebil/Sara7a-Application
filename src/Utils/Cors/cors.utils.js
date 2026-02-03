export const corsOptions = ()=>{
    const whiteList = process.env.WHITELIST

    const corsOption = {
        origin : (origin , challback)=>{
            if(!origin){
                return challback(null , true)
            }
            if(whiteList.includes(origin)){
                challback(null , true)
            }else{
                challback(new Error("This URL not allawed" , {cause : 400}))
            }
        },
        methods : ["GET" , "POST" , "PATCH" , "DELETE"]
    }

    return corsOption
}