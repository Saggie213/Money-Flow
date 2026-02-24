import { useGetAllTransactions } from './useQueries';
import { TransactionType } from '../backend';

export function useFinancialSummary() {
  const { data: transactions = [], isLoading } = useGetAllTransactions();

  const totalIncome = transactions
    .filter((tx) => tx.transactionType === TransactionType.income)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpenses = transactions
    .filter((tx) => tx.transactionType === TransactionType.expense)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const balance = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    balance,
    isLoading,
  };
}
