import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["otkup", "prodaja", "premestaj", "otpis"],
      required: true,
    },
    documentNumber: { type: String, unique: true }, // format: OTK-2023-001, PRO-2023-001
    date: { type: Date, default: Date.now },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number, // u kg
        pricePerUnit: Number, // cena po kg
        vatRate: Number,
        total: Number, // automatski izračunat
      },
    ],
    driverName: { type: String },
    vehiclePlate: { type: String },
    cost: { type: Number },
    notes: { type: String },
    status: {
      type: String,
      enum: ["u pripremi", "potvrđen", "otpremljen", "storniran"],
      default: "u pripremi",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
