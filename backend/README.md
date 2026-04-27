# Money Flow — Node.js Backend

Express + MongoDB rewrite of the original Motoko/ICP backend.

## Setup

```bash
npm install
cp .env.example .env   # fill in your values
npm run dev
```

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, returns JWT |

All other routes require `Authorization: Bearer <token>` header.

### Transactions
| Method | Endpoint | Motoko equivalent |
|--------|----------|-------------------|
| GET | /api/transactions | getUserTransactionsQuery() |
| GET | /api/transactions/income | getIncome() |
| GET | /api/transactions/expense | getExpenses() |
| GET | /api/transactions/categories/income | getIncomeCategories() |
| GET | /api/transactions/categories/expense | getExpenseCategories() |
| POST | /api/transactions | addTransaction() |
| PUT | /api/transactions/:id | updateTransaction() |
| DELETE | /api/transactions/:id | deleteTransaction() |

### Recurring Transactions
| Method | Endpoint | Motoko equivalent |
|--------|----------|-------------------|
| GET | /api/recurring | getUserRecurringTransactionsQuery() |
| POST | /api/recurring | addRecurringTransaction() |
| PUT | /api/recurring/:id | updateRecurringTransaction() |
| DELETE | /api/recurring/:id | deleteRecurringTransaction() |
| PATCH | /api/recurring/:id/toggle | toggleRecurringTransactionActive() |
| POST | /api/recurring/process | processRecurringTransactions() |

### Budget Limits
| Method | Endpoint | Motoko equivalent |
|--------|----------|-------------------|
| GET | /api/budgets | getUserBudgetLimitsQuery() |
| POST | /api/budgets | addBudgetLimit() |
| DELETE | /api/budgets/:category | deleteBudgetLimit() |

## Architecture

```
src/
├── index.js                        # Express app + MongoDB connection
├── middleware/
│   └── auth.js                     # JWT middleware (replaces ICP Principal)
├── models/
│   ├── Transaction.js              # Transaction schema
│   ├── RecurringTransaction.js     # RecurringTransaction schema
│   └── User.js                     # User + BudgetLimit schemas
└── routes/
    ├── auth.js                     # Register / Login
    ├── transactions.js             # CRUD + category queries
    ├── recurringTransactions.js    # CRUD + process engine
    └── budgets.js                  # CRUD budget limits
```

## Key Design Decisions (for interviews)

**ICP Principal → JWT Auth**
In the original Motoko backend, user identity was handled by the Internet Computer's
Principal system — every call was automatically authenticated by the ICP runtime.
In Node.js, I replaced this with JWT-based auth: users register/login to get a token,
and every protected route verifies it via middleware, setting req.user on the request.

**Motoko Map<Principal, List<T>> → MongoDB with user field**
The original Motoko code stored per-user data as Map<Principal, List<Transaction>>.
In MongoDB, each document has a `user` field referencing the User's ObjectId,
and queries filter by `{ user: req.user._id }` — functionally equivalent.

**Recurring Transaction Engine**
The shouldProcess() helper in recurringTransactions.js is a direct port of
shouldProcessRecurringTransaction() from Motoko — same frequency thresholds,
same active/startDate/endDate checks. The /process endpoint can be triggered
by a cron job (e.g., node-cron) daily instead of ICP's heartbeat mechanism.

**Budget upsert**
Motoko's addBudgetLimit did a filter-then-add to enforce one limit per category.
MongoDB's findOneAndUpdate with { upsert: true } achieves the same in one query.
