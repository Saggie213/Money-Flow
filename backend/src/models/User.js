const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// BudgetLimit — mirrors BudgetLimit type from Motoko
const budgetLimitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
});

// Enforce one budget limit per category per user (mirrors the filter+add pattern in Motoko)
budgetLimitSchema.index({ user: 1, category: 1 }, { unique: true });

// User — replaces ICP Principal authentication
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = {
  BudgetLimit: mongoose.model("BudgetLimit", budgetLimitSchema),
  User: mongoose.model("User", userSchema),
};
