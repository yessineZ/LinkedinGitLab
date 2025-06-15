import mongoose from "mongoose";

export const connectToDb = async () => {
    try {
       const conn =  await mongoose.connect(process.env.MONGO).then(() => {
            console.log("Connected to MongoDB");
        });
    }catch(err) {
        console.error(`Failed to connect to MongoDB: ${err.message}`) ;
    }
} 