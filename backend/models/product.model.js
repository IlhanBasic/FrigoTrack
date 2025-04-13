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
        "tresnja",
        "visnja",
      ],
      required: true,
    },
    variety: { type: String, required: true },
    sku: {
      type: String,
      unique: true,
      match: /^[A-Z]{3}-[A-Z]{3}-\d{4}$/,
    },
    harvestYear: {
      type: Number,
      min: 2020,
      max: new Date().getFullYear(),
      required: true,
    },
    purchasePrice: { type: Number, min: 0, required: true },
    sellingPrice: { type: Number, min: 0, required: true },
    vatRate: { type: Number, default: 20 },
    currentStockKg: { type: Number, default: 0 },
    minStockKg: { type: Number, default: 10 },
    coldRooms: [
      {
        coldRoom: { type: mongoose.Schema.Types.ObjectId, ref: "ColdRoom" },
        quantityKg: Number,
        storageDate: Date,
      },
    ],
    sugarContent: { type: Number, min: 0, max: 100 },
    acidity: { type: Number, min: 0 },
    brix: { type: Number },
    freezingMethod: { type: String, enum: ["IQF", "block"] },
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
