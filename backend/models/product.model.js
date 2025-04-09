import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: [
        "malina",
        "jagoda",
        "ribizla",
        "kupina",
        "borovnica",
        "trešnja",
        "višnja",
      ],
      required: true,
    },
    variety: { type: String, required: true }, // npr. 'Polka' za maline
    sku: {
      type: String,
      unique: true,
      match: /^[A-Z]{3}-[A-Z]{3}-\d{4}$/, // npr. MAL-POL-2023
    },
    harvestYear: {
      type: Number,
      min: 2020,
      max: new Date().getFullYear(),
      required: true,
    },
    purchasePrice: { type: Number, min: 0, required: true }, // RSD/kg
    sellingPrice: { type: Number, min: 0, required: true }, // RSD/kg
    vatRate: { type: Number, default: 20 }, // 20% PDV
    units: {
      paleta: { type: Number, default: 250 }, // 1 paleta = 250kg
      kg: { type: Number, default: 1 },
    },
    minStock: { type: Number, default: 10 }, // alert za niske zalihe
    currentStock: { type: Number, default: 0 }, // ukupno u paletama
    coldRooms: [
      {
        coldRoom: { type: mongoose.Schema.Types.ObjectId, ref: "ColdRoom" },
        quantity: Number,
        storageDate: Date,
      },
    ],
    qualityIndicators: {
      sugarContent: { type: Number, min: 0, max: 100 },
      acidity: { type: Number, min: 0 },
      brix: { type: Number },
      freezingMethod: { type: String, enum: ["IQF", "block"] },
    },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },
    expiryDate: Date,
    isActive: { type: Boolean, default: true },
    priceHistory: [
      {
        date: { type: Date, default: Date.now },
        purchasePrice: Number,
        sellingPrice: Number,
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
