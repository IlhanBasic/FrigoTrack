import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.listen(5000, () => {
    console.log('Server is running on port 5000');
    connectDB();
})