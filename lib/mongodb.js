import mongoose from "mongoose";

export const connectMongoDB =  async () => {
    try {
        await mongoose.connect(process.env.MONGO)
        // console.log("connect successfully");
    } catch (error) {
        console.log("Fail to connect", error);
    }
}