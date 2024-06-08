import mongoose from "mongoose";

const PurchaseHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["pending", "delivering", "complete"],
    default: "pending",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

export default mongoose.model("PurchaseHistory", PurchaseHistorySchema);
