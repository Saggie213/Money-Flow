const express = require("express");
const RecurringTransaction = require("../models/RecurringTransaction");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

// Helper — mirrors shouldProcessRecurringTransaction() from Motoko
const shouldProcess = (rt) => {
  const now = new Date();
  if (!rt.active) return false;
  if (now < rt.startDate) return false;
  if (rt.endDate && now > rt.endDate) return false;

  if (!rt.lastExecutionDate) return true; // never run yet

  const ms = now - new Date(rt.lastExecutionDate);
  const day = 24 * 60 * 60 * 1000;
  const thresholds = {
    daily: day,
    weekly: 7 * day,
    monthly: 30 * day,
    yearly: 365 * day,
  };
  return ms >= thresholds[rt.frequency];
};

// GET /api/recurring — mirrors getUserRecurringTransactionsQuery()
router.get("/", async (req, res) => {
  try {
    const recurring = await RecurringTransaction.find({ user: req.user._id });
    res.json(recurring);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/recurring — mirrors addRecurringTransaction()
router.post("/", async (req, res) => {
  try {
    const { transactionType, category, amount, description, frequency, startDate, endDate } = req.body;
    const rt = await RecurringTransaction.create({
      user: req.user._id,
      transactionType,
      category,
      amount,
      description,
      frequency,
      startDate,
      endDate: endDate || null,
    });
    res.status(201).json(rt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/recurring/:id — mirrors updateRecurringTransaction()
router.put("/:id", async (req, res) => {
  try {
    const { transactionType, category, amount, description, frequency, startDate, endDate } = req.body;
    const rt = await RecurringTransaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { transactionType, category, amount, description, frequency, startDate, endDate: endDate || null },
      { new: true }
    );
    if (!rt) return res.status(404).json({ error: "Not found" });
    res.json(rt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/recurring/:id — mirrors deleteRecurringTransaction()
router.delete("/:id", async (req, res) => {
  try {
    const rt = await RecurringTransaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!rt) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/recurring/:id/toggle — mirrors toggleRecurringTransactionActive()
router.patch("/:id/toggle", async (req, res) => {
  try {
    const rt = await RecurringTransaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!rt) return res.status(404).json({ error: "Not found" });
    rt.active = !rt.active;
    await rt.save();
    res.json({ active: rt.active });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/recurring/process — mirrors processRecurringTransactions()
// Call this on a schedule (e.g. cron job daily) or on app load
router.post("/process", async (req, res) => {
  try {
    // Fetch all active recurring transactions across all users
    const allRecurring = await RecurringTransaction.find({ active: true });
    const now = new Date();
    const created = [];

    for (const rt of allRecurring) {
      if (!shouldProcess(rt)) continue;

      // Create the actual transaction — mirrors convertRecurringToTransaction()
      const tx = await Transaction.create({
        user: rt.user,
        amount: rt.amount,
        category: rt.category,
        description: rt.description,
        transactionType: rt.transactionType,
      });

      // Update lastExecutionDate — mirrors the update in processRecurringTransactions()
      rt.lastExecutionDate = now;
      await rt.save();

      created.push(tx);
    }

    res.json({ processed: created.length, transactions: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
