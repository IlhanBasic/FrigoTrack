import mongoose from 'mongoose'; 
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import Partner from '../models/partner.model.js';
import Document from '../models/document.model.js';
import Payment from '../models/payment.model.js';
import ColdRoom from '../models/coldRoom.model.js';
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await Product.createCollection();
        await User.createCollection();
        await Partner.createCollection();
        await Document.createCollection();
        await Payment.createCollection();
        await ColdRoom.createCollection();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;