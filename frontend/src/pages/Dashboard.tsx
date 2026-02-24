import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import BalanceDisplay from '../components/BalanceDisplay';
import IncomeChart from '../components/IncomeChart';
import ExpenseChart from '../components/ExpenseChart';
import AddTransactionModal from '../components/AddTransactionModal';
import FinancialHealthScore from '../components/FinancialHealthScore';
import ExpensePrediction from '../components/ExpensePrediction';
import { useProcessRecurringTransactions } from '../hooks/useQueries';
import { useRecurringTransactionNotifications } from '../hooks/useRecurringTransactionNotifications';

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const processRecurringTransactions = useProcessRecurringTransactions();

  // Enable recurring transaction notifications
  useRecurringTransactionNotifications();

  // Process recurring transactions on dashboard load
  useEffect(() => {
    processRecurringTransactions.mutate();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your financial health</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-600 dark:hover:to-teal-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <BalanceDisplay />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeChart />
        <ExpenseChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialHealthScore />
        <ExpensePrediction />
      </div>

      <AddTransactionModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
    </div>
  );
}
