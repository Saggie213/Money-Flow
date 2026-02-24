import { useGetBudgetLimits, useGetExpenses } from './useQueries';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

export function useBudgetNotifications() {
  const { data: budgetLimits = [] } = useGetBudgetLimits();
  const { data: expenses = [] } = useGetExpenses();
  const notifiedCategories = useRef(new Set<string>());

  const getCurrentMonthExpenses = (category: string) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter((tx) => {
        const txDate = new Date(Number(tx.timestamp) / 1000000);
        return (
          tx.category === category &&
          txDate.getMonth() === currentMonth &&
          txDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
  };

  const checkBudgetExceeded = (category: string, newAmount: number) => {
    const limit = budgetLimits.find((bl) => bl.category === category);
    if (!limit) return;

    const currentSpending = getCurrentMonthExpenses(category);
    const totalSpending = currentSpending + newAmount;
    const limitAmount = Number(limit.limit);

    if (totalSpending > limitAmount) {
      const exceeded = totalSpending - limitAmount;
      toast.error(`Budget Exceeded!`, {
        description: `${category}: ₹${exceeded.toLocaleString('en-IN')} over budget`,
      });
    } else if (totalSpending > limitAmount * 0.9) {
      const remaining = limitAmount - totalSpending;
      toast.warning(`Budget Alert`, {
        description: `${category}: Only ₹${remaining.toLocaleString('en-IN')} remaining`,
      });
    }
  };

  useEffect(() => {
    budgetLimits.forEach((limit) => {
      const spending = getCurrentMonthExpenses(limit.category);
      const limitAmount = Number(limit.limit);
      const key = `${limit.category}-${new Date().getMonth()}`;

      if (spending > limitAmount && !notifiedCategories.current.has(key)) {
        const exceeded = spending - limitAmount;
        toast.error(`Budget Exceeded!`, {
          description: `${limit.category}: ₹${exceeded.toLocaleString('en-IN')} over budget`,
        });
        notifiedCategories.current.add(key);
      }
    });
  }, [budgetLimits, expenses]);

  return { checkBudgetExceeded };
}
