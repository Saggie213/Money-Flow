import { useEffect, useRef } from 'react';
import { useGetAllTransactions } from './useQueries';
import { useFinancialSummary } from './useFinancialSummary';
import { TransactionType } from '../backend';
import { toast } from 'sonner';

export function useTransactionNotifications() {
  const { data: transactions = [] } = useGetAllTransactions();
  const { balance } = useFinancialSummary();
  const previousTransactionCount = useRef(transactions.length);

  useEffect(() => {
    // Only check for new transactions, not on initial load
    if (previousTransactionCount.current === 0 && transactions.length > 0) {
      previousTransactionCount.current = transactions.length;
      return;
    }

    if (transactions.length > previousTransactionCount.current) {
      // Get the newest transaction
      const newestTransaction = transactions[transactions.length - 1];
      const amount = Number(newestTransaction.amount);

      // Check for significant income (> 10,000 rupees)
      if (newestTransaction.transactionType === TransactionType.income && amount > 10000) {
        toast.success(`₹${amount.toLocaleString('en-IN')} added to income`, {
          description: `Great! Your income has increased significantly.`,
          duration: 5000,
        });
      }

      // Check for significant expense (> 5,000 rupees)
      if (newestTransaction.transactionType === TransactionType.expense && amount > 5000) {
        toast.warning(`₹${amount.toLocaleString('en-IN')} expense recorded`, {
          description: `Large expense in ${newestTransaction.category}`,
          duration: 5000,
        });
      }

      // Check for low balance (< 1,000 rupees)
      if (balance < 1000) {
        toast.error(`Low balance warning: ₹${balance.toLocaleString('en-IN')} remaining`, {
          description: 'Consider reviewing your expenses',
          duration: 6000,
        });
      }
    }

    previousTransactionCount.current = transactions.length;
  }, [transactions, balance]);
}
