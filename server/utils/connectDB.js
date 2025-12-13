import mongoose from "mongoose";

const connectDB = async (url) => {
    try {
        if (!url) throw new Error("MONGODB_URI is not provided");
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message || err);
        throw err;
    }
}

export default connectDB;