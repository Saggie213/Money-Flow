const express = require("express");
const { BudgetLimit } = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

// GET /api/budgets — mirrors getUserBudgetLimitsQuery()
router.get("/", async (req, res) => {
  try {
    const limits = await BudgetLimit.find({ user: req.user._id });
    res.json(limits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/budgets — mirrors addBudgetLimit()
// Uses upsert to replicate Motoko's "filter existing then add" pattern
router.post("/", async (req, res) => {
  try {
    const { category, limit } = req.body;
    const budgetLimit = await BudgetLimit.findOneAndUpdate(
      { user: req.user._id, category },
      { limit },
      { upsert: true, new: true }
    );
    res.status(201).json(budgetLimit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/budgets/:category — mirrors deleteBudgetLimit()
router.delete("/:category", async (req, res) => {
  try {
    const result = await BudgetLimit.findOneAndDelete({
      user: req.user._id,
      category: req.params.category,
    });
    if (!result) return res.status(404).json({ error: "Budget limit not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
