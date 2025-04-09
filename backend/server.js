import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import userRoute from './routes/user.route.js';
import coldRoute from './routes/coldRoom.route.js'; 
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoute);
app.use('/api/coldRooms', coldRoute);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
    connectDB();
});