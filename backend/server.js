import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import cookies from 'cookie-parser'
import userRoute from './routes/user.route.js';
import coldRoute from './routes/coldRoom.route.js'; 
import partnerRoute from './routes/partner.route.js';
import productRoute from './routes/product.route.js';
import documentRoute from './routes/document.route.js';
import paymentRoute from './routes/payment.route.js';
const app = express();
dotenv.config();
app.use(cookies());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use('/api/users', userRoute);
app.use('/api/coldrooms', coldRoute);
app.use('/api/partners', partnerRoute);
app.use('/api/products', productRoute);
app.use('/api/documents', documentRoute);
app.use('/api/payments', paymentRoute);
app.listen(process.env.PORT, () => {
    console.log('Server is running on port 5000');
    connectDB();
});