import { useEffect, useRef } from 'react';
import { useGetAllTransactions } from './useQueries';
import { TransactionType } from '../backend';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export function useRecurringTransactionNotifications() {
  const { data: transactions = [] } = useGetAllTransactions();
  const previousTransactionIds = useRef(new Set<string>());
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize the set on first load
    if (previousTransactionIds.current.size === 0 && transactions.length > 0) {
      transactions.forEach((tx) => {
        previousTransactionIds.current.add(tx.id.toString());
      });
      return;
    }

    // Check for new transactions
    const newTransactions = transactions.filter(
      (tx) => !previousTransactionIds.current.has(tx.id.toString())
    );

    // Notify about new transactions (likely from recurring)
    newTransactions.forEach((tx) => {
      const amount = Number(tx.amount);
      const typeLabel = tx.transactionType === TransactionType.income ? 'Income' : 'Expense';
      
      toast.info(`Recurring transaction executed`, {
        description: `${typeLabel}: ₹${amount.toLocaleString('en-IN')} in ${tx.category}`,
        duration: 6000,
        action: {
          label: 'View',
          onClick: () => navigate({ to: '/transactions' }),
        },
      });

      previousTransactionIds.current.add(tx.id.toString());
    });
  }, [transactions, navigate]);
}
