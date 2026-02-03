import mongoose from "mongoose";

const connectionDB = async()=>{
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log(`DataBase Connected Done ✅`);
    } catch (error) {
        console.log(`DataBase Failed To Connect ❌`);
    }
}

export default connectionDB;