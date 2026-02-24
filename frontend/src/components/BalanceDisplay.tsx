import { Card, CardContent } from '@/components/ui/card';
import { useFinancialSummary } from '../hooks/useFinancialSummary';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function BalanceDisplay() {
  const { totalIncome, totalExpenses, balance, isLoading } = useFinancialSummary();

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="h-12 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-lg border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹{totalIncome.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-red-200 dark:border-red-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ₹{totalExpenses.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-red-400'}`}>
                ₹{balance.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
