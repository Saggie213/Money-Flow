import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import BudgetLimitForm from '../components/BudgetLimitForm';
import BudgetProgressCard from '../components/BudgetProgressCard';
import { useGetBudgetLimits, useGetExpenses } from '../hooks/useQueries';

export default function BudgetPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: budgetLimits = [] } = useGetBudgetLimits();
  const { data: expenses = [] } = useGetExpenses();

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
          <p className="text-muted-foreground">Set and track your monthly spending limits</p>
        </div>
        <Button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          {isFormOpen ? 'Cancel' : 'Add Budget'}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Set Budget Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetLimitForm onSuccess={() => setIsFormOpen(false)} />
          </CardContent>
        </Card>
      )}

      {budgetLimits.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-12 text-center text-muted-foreground">
            No budget limits set. Add your first budget to start tracking!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetLimits.map((limit) => (
            <BudgetProgressCard
              key={limit.category}
              category={limit.category}
              limit={Number(limit.limit)}
              spent={getCurrentMonthExpenses(limit.category)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
