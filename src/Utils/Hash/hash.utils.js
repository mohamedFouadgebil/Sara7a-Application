import bcrypt from "bcrypt";

export const hash = async({plaintext = "" , saltRound = Number(process.env.SALTROUND)})=>{
    return bcrypt.hash(plaintext , saltRound)
}

export const compare = async({plaintext = "" , hash = ""})=>{
    return bcrypt.compare(plaintext , hash)
}
