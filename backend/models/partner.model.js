import mongoose from 'mongoose';
const partnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String,required:false},
    phone: { type: String, required: true },
    pibOrJmbg: { type: String, required: true },
    isVATRegistered: { type: Boolean, default: false },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isActive: { type: Boolean, default: true },
    type: { type: String, enum: ['poljoprivrednik', 'kupac'], required: true },
    bankDetails: {
      accountNumber: String,
      bankName: String
    },
    contracts: [{
      type: String,
      startDate: Date,
      endDate: Date,
      fileUrl: String
    }]
  }, { timestamps: true });  

export default mongoose.model('Partner', partnerSchema);