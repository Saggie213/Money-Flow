import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetExpenses, useGetExpenseCategories } from '../hooks/useQueries';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const EXPENSE_COLORS = [
  'oklch(0.60 0.22 25)',
  'oklch(0.65 0.20 30)',
  'oklch(0.70 0.18 35)',
  'oklch(0.55 0.24 20)',
  'oklch(0.68 0.19 40)',
  'oklch(0.62 0.21 28)',
  'oklch(0.72 0.17 45)',
  'oklch(0.58 0.23 23)',
  'oklch(0.66 0.20 33)',
  'oklch(0.64 0.21 27)',
  'oklch(0.69 0.18 38)',
  'oklch(0.61 0.22 26)',
  'oklch(0.67 0.19 32)',
  'oklch(0.63 0.21 29)',
  'oklch(0.71 0.17 42)',
  'oklch(0.59 0.23 24)',
];

export default function ExpenseChart() {
  const { data: expenses = [], isLoading: expensesLoading } = useGetExpenses();
  const { data: categories = [], isLoading: categoriesLoading } = useGetExpenseCategories();

  const isLoading = expensesLoading || categoriesLoading;

  const categoryData = categories.map((category) => {
    const total = expenses
      .filter((tx) => tx.category === category)
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    return { name: category, value: total };
  }).filter((item) => item.value > 0);

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0);

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Expenses</span>
          <span className="text-2xl font-bold text-red-600 dark:text-red-400">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categoryData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No expense data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                contentStyle={{
                  backgroundColor: 'oklch(var(--card))',
                  border: '1px solid oklch(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => {
                  const percentage = ((entry.payload.value / totalExpenses) * 100).toFixed(1);
                  return `${value} (${percentage}%)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
