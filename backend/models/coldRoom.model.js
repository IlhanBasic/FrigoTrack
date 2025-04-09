import mongoose from "mongoose";
const coldRoomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    location: { type: String }, // npr. "Objekat 1 - Hala A"
    temperature: { type: Number }, // npr. -18
    capacityKg: { type: Number }, // maksimalni kapacitet
    currentLoadKg: { type: Number, default: 0 },
    type: { type: String, enum: ['standard', 'shock freezer'] },
    isActive: { type: Boolean, default: true },
  }, { timestamps: true });
export default mongoose.model('ColdRoom', coldRoomSchema);
  