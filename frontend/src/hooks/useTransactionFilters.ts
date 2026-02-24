import { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../backend';

interface Filters {
  type: 'all' | 'income' | 'expense';
  category: string;
  dateFrom: string;
  dateTo: string;
  searchAmount: string;
}

export function useTransactionFilters(transactions: Transaction[]) {
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    searchAmount: '',
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (filters.type !== 'all') {
        const txType = tx.transactionType === TransactionType.income ? 'income' : 'expense';
        if (txType !== filters.type) return false;
      }

      if (filters.category !== 'all' && tx.category !== filters.category) {
        return false;
      }

      if (filters.dateFrom) {
        const txDate = new Date(Number(tx.timestamp) / 1000000);
        const fromDate = new Date(filters.dateFrom);
        if (txDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const txDate = new Date(Number(tx.timestamp) / 1000000);
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (txDate > toDate) return false;
      }

      if (filters.searchAmount) {
        const searchNum = parseFloat(filters.searchAmount);
        if (Number(tx.amount) !== searchNum) return false;
      }

      return true;
    });
  }, [transactions, filters]);

  return {
    filters,
    setFilters,
    filteredTransactions,
  };
}
