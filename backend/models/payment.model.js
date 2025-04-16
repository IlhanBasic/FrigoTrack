import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
  {
    document: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
    amountPaid: Number,
    paymentDate: Date,
    //method: { type: String, enum: ["gotovina", "račun"] },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
export default mongoose.model("Payment", paymentSchema);
