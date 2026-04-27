const mongoose = require("mongoose");

// Mirrors the Transaction type from Motoko actor
const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    transactionType: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
  },
  { timestamps: true } // createdAt = timestamp equivalent from Motoko
);

module.exports = mongoose.model("Transaction", transactionSchema);
