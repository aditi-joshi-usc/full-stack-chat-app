import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);  // Use the connection string from your .env file
        console.log("MongoDB connected successfully", conn.connection.host, conn.connection.port); // Log the host and port of the connection
    } catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1); // Exit the process with failure
    }
}