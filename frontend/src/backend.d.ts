import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RecurringTransaction {
    id: bigint;
    active: boolean;
    transactionType: TransactionType;
    endDate?: Time;
    description: string;
    lastPeriodicExecution: Time;
    category: string;
    frequency: Frequency;
    amount: bigint;
    lastExecutionDate: Time;
    startDate: Time;
}
export type Time = bigint;
export interface BudgetLimit {
    limit: bigint;
    category: string;
}
export interface Transaction {
    id: bigint;
    transactionType: TransactionType;
    description: string;
    timestamp: Time;
    category: string;
    amount: bigint;
}
export enum Frequency {
    monthly = "monthly",
    yearly = "yearly",
    daily = "daily",
    weekly = "weekly"
}
export enum TransactionType {
    expense = "expense",
    income = "income"
}
export interface backendInterface {
    addBudgetLimit(category: string, limit: bigint): Promise<void>;
    addRecurringTransaction(category: string, amount: bigint, description: string, transactionType: TransactionType, frequency: Frequency, startDate: Time, endDate: Time | null): Promise<bigint>;
    addTransaction(amount: bigint, category: string, description: string, transactionType: TransactionType): Promise<bigint>;
    deleteBudgetLimit(category: string): Promise<void>;
    deleteRecurringTransaction(id: bigint): Promise<void>;
    deleteTransaction(id: bigint): Promise<void>;
    getAllRecurringTransactions(): Promise<Array<RecurringTransaction>>;
    getAllTransactions(): Promise<Array<Transaction>>;
    getExpenseCategories(): Promise<Array<string>>;
    getExpenses(): Promise<Array<Transaction>>;
    getIncome(): Promise<Array<Transaction>>;
    getIncomeCategories(): Promise<Array<string>>;
    getTransactionsByCategory(category: string): Promise<Array<Transaction>>;
    getTransactionsByType(transactionType: TransactionType): Promise<Array<Transaction>>;
    getUserBudgetLimitsQuery(): Promise<Array<BudgetLimit>>;
    getUserRecurringTransactionsQuery(): Promise<Array<RecurringTransaction>>;
    getUserTransactionsQuery(): Promise<Array<Transaction>>;
    processRecurringTransactions(): Promise<void>;
    toggleRecurringTransactionActive(id: bigint): Promise<boolean>;
    updateRecurringTransaction(id: bigint, category: string, amount: bigint, description: string, transactionType: TransactionType, frequency: Frequency, startDate: Time, endDate: Time | null): Promise<void>;
    updateTransaction(id: bigint, amount: bigint, category: string, description: string): Promise<void>;
}
