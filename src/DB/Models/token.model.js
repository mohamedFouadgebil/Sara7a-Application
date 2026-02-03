import mongoose , {Schema} from "mongoose";

export const tokenSchema = new mongoose.Schema(
    {
        jwtid: {
            type: String,
            unique: true,
            required: true,
        },
        expireIn: {
            type: Date,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const tokenModel =
    mongoose.models.Token || mongoose.model("Token", tokenSchema);
export default tokenModel;
