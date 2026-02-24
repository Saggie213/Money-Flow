import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Transaction, TransactionType, BudgetLimit, RecurringTransaction, Frequency } from '../backend';
import { toast } from 'sonner';

export function useGetAllTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserTransactionsQuery();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetIncome() {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['income'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIncome();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetExpenses() {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['expenses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExpenses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBudgetLimits() {
  const { actor, isFetching } = useActor();

  return useQuery<BudgetLimit[]>({
    queryKey: ['budgetLimits'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserBudgetLimitsQuery();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetIncomeCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['incomeCategories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIncomeCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetExpenseCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['expenseCategories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExpenseCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecurringTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<RecurringTransaction[]>({
    queryKey: ['recurringTransactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserRecurringTransactionsQuery();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amount,
      category,
      description,
      transactionType,
    }: {
      amount: number;
      category: string;
      description: string;
      transactionType: TransactionType;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addTransaction(BigInt(amount), category, description, transactionType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['income'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Transaction added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add transaction: ' + error.message);
    },
  });
}

export function useUpdateTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      amount,
      category,
      description,
    }: {
      id: bigint;
      amount: number;
      category: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateTransaction(id, BigInt(amount), category, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['income'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Transaction updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update transaction: ' + error.message);
    },
  });
}

export function useDeleteTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteTransaction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['income'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Transaction deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete transaction: ' + error.message);
    },
  });
}

export function useAddBudgetLimit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category, limit }: { category: string; limit: number }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addBudgetLimit(category, BigInt(limit));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetLimits'] });
      toast.success('Budget limit saved successfully');
    },
    onError: (error) => {
      toast.error('Failed to save budget limit: ' + error.message);
    },
  });
}

export function useDeleteBudgetLimit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteBudgetLimit(category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetLimits'] });
      toast.success('Budget limit removed successfully');
    },
    onError: (error) => {
      toast.error('Failed to remove budget limit: ' + error.message);
    },
  });
}

export function useAddRecurringTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      category,
      amount,
      description,
      transactionType,
      frequency,
      startDate,
      endDate,
    }: {
      category: string;
      amount: number;
      description: string;
      transactionType: TransactionType;
      frequency: Frequency;
      startDate: bigint;
      endDate: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addRecurringTransaction(
        category,
        BigInt(amount),
        description,
        transactionType,
        frequency,
        startDate,
        endDate
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringTransactions'] });
      toast.success('Recurring transaction created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create recurring transaction: ' + error.message);
    },
  });
}

export function useUpdateRecurringTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      category,
      amount,
      description,
      transactionType,
      frequency,
      startDate,
      endDate,
    }: {
      id: bigint;
      category: string;
      amount: number;
      description: string;
      transactionType: TransactionType;
      frequency: Frequency;
      startDate: bigint;
      endDate: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateRecurringTransaction(
        id,
        category,
        BigInt(amount),
        description,
        transactionType,
        frequency,
        startDate,
        endDate
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringTransactions'] });
      toast.success('Recurring transaction updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update recurring transaction: ' + error.message);
    },
  });
}

export function useDeleteRecurringTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteRecurringTransaction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringTransactions'] });
      toast.success('Recurring transaction deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete recurring transaction: ' + error.message);
    },
  });
}

export function useToggleRecurringTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.toggleRecurringTransactionActive(id);
    },
    onSuccess: (isActive) => {
      queryClient.invalidateQueries({ queryKey: ['recurringTransactions'] });
      toast.success(isActive ? 'Recurring transaction activated' : 'Recurring transaction deactivated');
    },
    onError: (error) => {
      toast.error('Failed to toggle recurring transaction: ' + error.message);
    },
  });
}

export function useProcessRecurringTransactions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.processRecurringTransactions();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['income'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['recurringTransactions'] });
    },
    onError: (error) => {
      console.error('Failed to process recurring transactions:', error);
    },
  });
}
