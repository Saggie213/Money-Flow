require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const transactionRoutes = require("./routes/transactions");
const recurringRoutes = require("./routes/recurringTransactions");
const budgetRoutes = require("./routes/budgets");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/recurring", recurringRoutes);
app.use("/api/budgets", budgetRoutes);

// Health check
app.get("/", (req, res) => res.json({ message: "Money Flow API running" }));

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/moneyflow")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("DB connection error:", err));
