# 💰 MoneyFlow

MoneyFlow is a modern full-stack personal finance management platform built with **React, TypeScript, Motoko (ICP backend)**.

It allows users to track income and expenses, manage budgets, automate recurring transactions, visualize financial data, and monitor financial health — all in a secure, responsive interface.

---

## 🚀 Live Features

### 🔐 Authentication
- Internet Identity integration
- Secure session management
- Protected routes for authenticated users

### 💵 Income & Expense Tracking
- Add, edit, delete transactions
- Categorized income & expense types
- Transaction filtering (type, category, date range, amount)
- CSV export functionality

### 🔁 Recurring Transactions
- Create income/expense recurring entries
- Frequency selection (daily, weekly, monthly)
- Automatic execution logic
- Real-time recurring transaction notifications

### 📊 Financial Analytics
- Balance overview (Income / Expense / Net Balance)
- Income distribution chart
- Expense breakdown pie chart
- Monthly/Yearly financial summaries
- Custom date range reporting
- Expense prediction (based on last 3 months)
- Financial Health Score (Savings Rate Based)

### 🎯 Budget Management
- Set monthly budget limits per category
- Budget usage progress bars
- 90% threshold warnings
- Budget exceeded alerts

### 🔔 Smart Notifications
- Large expense alert (> 5k)
- Large income alert (> 10k)
- Low balance warning (< 1k)
- Budget threshold notifications
- Recurring transaction execution alerts

### 🌙 UI & UX
- Light/Dark theme (OKLCH color system)
- Responsive navigation (desktop + mobile drawer)
- Modern Tailwind + custom theming
- Animated transitions

---

## 🏗 Architecture Overview

### Frontend
- React + TypeScript
- TanStack Router
- React Query
- Recharts
- Tailwind CSS (OKLCH custom theme)
- Internet Identity integration

### Backend
- Motoko Actor (ICP Canister)
- Recurring transaction processor
- Budget validation logic
- Aggregation & financial summary queries

### Data Layer
- Structured transaction model
- Budget limit model
- Recurring transaction model
- Migration support for schema upgrades

---
