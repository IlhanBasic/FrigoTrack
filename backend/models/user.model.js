import mongoose, { mongo } from 'mongoose';
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    department: { type: String, enum: ['administracija', 'skladište', 'prodaja'] },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);