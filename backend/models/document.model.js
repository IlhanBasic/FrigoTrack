import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["otkup", "prodaja","otpis"],
    required: true,
  },
  documentNumber: { type: String, unique: true },
  date: { type: Date, default: Date.now },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true,
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      pricePerUnit: Number,
      vatRate: Number,
      total: Number,
    },
  ],
  transportCost: { type: Number },
  notes: { type: String },
  status: {
    type: String,
    enum: ["u pripremi", "potvrđen", "otpremljen", "storniran"],
    default: "u pripremi",
  },
  isPaid: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Document", documentSchema);

