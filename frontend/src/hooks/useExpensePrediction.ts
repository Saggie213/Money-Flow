import { useGetExpenses } from './useQueries';

export function useExpensePrediction() {
  const { data: expenses = [], isLoading } = useGetExpenses();

  const categoryPredictions = (() => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

    const recentExpenses = expenses.filter((tx) => {
      const txDate = new Date(Number(tx.timestamp) / 1000000);
      return txDate >= threeMonthsAgo;
    });

    if (recentExpenses.length === 0) return [];

    const categoryTotals: Record<string, { total: number; months: Set<string> }> = {};

    recentExpenses.forEach((tx) => {
      const txDate = new Date(Number(tx.timestamp) / 1000000);
      const monthKey = `${txDate.getFullYear()}-${txDate.getMonth()}`;

      if (!categoryTotals[tx.category]) {
        categoryTotals[tx.category] = { total: 0, months: new Set() };
      }

      categoryTotals[tx.category].total += Number(tx.amount);
      categoryTotals[tx.category].months.add(monthKey);
    });

    return Object.entries(categoryTotals)
      .map(([category, data]) => ({
        category,
        predicted: Math.round(data.total / data.months.size),
      }))
      .sort((a, b) => b.predicted - a.predicted);
  })();

  const predictedTotal = categoryPredictions.reduce((sum, pred) => sum + pred.predicted, 0);

  return {
    categoryPredictions,
    predictedTotal,
    isLoading,
  };
}
