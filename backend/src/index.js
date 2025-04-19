import express from 'express';
import mongoose, { connect } from 'mongoose';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './lib/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);


app.listen(5001, () => {
    connectDB();
    console.log('Server is running on port', PORT);
});