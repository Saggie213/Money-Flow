import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetAllTransactions } from '../hooks/useQueries';
import { TransactionType } from '../backend';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinancialSummaryProps {
  period: 'month' | 'year' | 'custom';
}

export default function FinancialSummary({ period }: FinancialSummaryProps) {
  const { data: transactions = [], isLoading } = useGetAllTransactions();
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const getDateRange = () => {
    const now = new Date();
    let from: Date;
    let to: Date = now;

    if (period === 'month') {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'year') {
      from = new Date(now.getFullYear(), 0, 1);
    } else {
      from = customFrom ? new Date(customFrom) : new Date(now.getFullYear(), 0, 1);
      to = customTo ? new Date(customTo) : now;
    }

    return { from, to };
  };

  const { from, to } = getDateRange();

  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(Number(tx.timestamp) / 1000000);
    return txDate >= from && txDate <= to;
  });

  const totalIncome = filteredTransactions
    .filter((tx) => tx.transactionType === TransactionType.income)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((tx) => tx.transactionType === TransactionType.expense)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const netBalance = totalIncome - totalExpenses;

  const chartData = [
    {
      name: 'Summary',
      Income: totalIncome,
      Expenses: totalExpenses,
    },
  ];

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-12">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {period === 'custom' && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Custom Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              ₹{totalIncome.toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              ₹{totalExpenses.toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-teal-200 dark:border-teal-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-red-400'}`}>
              ₹{netBalance.toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
              <XAxis dataKey="name" stroke="oklch(var(--foreground))" />
              <YAxis stroke="oklch(var(--foreground))" />
              <Tooltip
                formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                contentStyle={{
                  backgroundColor: 'oklch(var(--card))',
                  border: '1px solid oklch(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="Income" fill="oklch(0.65 0.18 160)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Expenses" fill="oklch(0.60 0.22 25)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
