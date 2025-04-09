import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: { type: String, enum: ['otkup', 'prodaja', 'premestaj', 'otpis'], required: true },
    documentNumber: { type: String, unique: true }, // format: OTK-2023-001, PRO-2023-001
    date: { type: Date, default: Date.now },
    partner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Partner',
      required: true
    },
    items: [{   
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number, // u paletama
      pricePerUnit: Number, // cena po kg
      vatRate: Number,
      total: Number // automatski izračunat
    }],
    transport: {
      driverName: String,
      vehiclePlate: String,
      cost: Number,
      notes: String
    },
    status: { type: String, enum: ['u pripremi', 'potvrđen', 'otpremljen', 'storniran'], default: 'u pripremi' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: String
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);  
  