const express = require("express");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

const router = express.Router();

// All routes are protected — req.user replaces ICP caller Principal
router.use(auth);

// GET /api/transactions — mirrors getUserTransactionsQuery()
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions/income — mirrors getIncome()
router.get("/income", async (req, res) => {
  try {
    const income = await Transaction.find({ user: req.user._id, transactionType: "income" }).sort({ createdAt: -1 });
    res.json(income);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions/expense — mirrors getExpenses()
router.get("/expense", async (req, res) => {
  try {
    const expenses = await Transaction.find({ user: req.user._id, transactionType: "expense" }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions/categories/income — mirrors getIncomeCategories()
router.get("/categories/income", (req, res) => {
  res.json([
    "Salary", "Business", "Investments", "Extra income", "Deposits",
    "Rental Income", "Freelance", "Dividends", "Interest", "Bonuses", "Gifts", "Refunds",
  ]);
});

// GET /api/transactions/categories/expense — mirrors getExpenseCategories()
router.get("/categories/expense", (req, res) => {
  res.json([
    "Bills", "Car", "Clothes", "Travel", "Shopping", "House", "Entertainment",
    "Food & Dining", "Healthcare", "Education", "Insurance", "Utilities",
    "Subscriptions", "Personal Care", "Pets", "Miscellaneous",
  ]);
});

// POST /api/transactions — mirrors addTransaction()
router.post("/", async (req, res) => {
  try {
    const { amount, category, description, transactionType } = req.body;
    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      category,
      description,
      transactionType,
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/transactions/:id — mirrors updateTransaction()
router.put("/:id", async (req, res) => {
  try {
    const { amount, category, description } = req.body;
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // ensure user owns it
      { amount, category, description },
      { new: true }
    );
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/transactions/:id — mirrors deleteTransaction()
router.delete("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
