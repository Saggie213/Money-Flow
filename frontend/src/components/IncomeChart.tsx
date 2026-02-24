import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetIncome, useGetIncomeCategories } from '../hooks/useQueries';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const INCOME_COLORS = [
  'oklch(0.65 0.18 160)',
  'oklch(0.60 0.16 165)',
  'oklch(0.55 0.14 170)',
  'oklch(0.70 0.15 155)',
  'oklch(0.50 0.12 175)',
  'oklch(0.68 0.17 158)',
  'oklch(0.58 0.15 168)',
  'oklch(0.63 0.16 163)',
  'oklch(0.53 0.13 173)',
  'oklch(0.67 0.18 157)',
  'oklch(0.57 0.14 167)',
  'oklch(0.62 0.15 162)',
];

export default function IncomeChart() {
  const { data: income = [], isLoading: incomeLoading } = useGetIncome();
  const { data: categories = [], isLoading: categoriesLoading } = useGetIncomeCategories();

  const isLoading = incomeLoading || categoriesLoading;

  const categoryData = categories.map((category) => {
    const total = income
      .filter((tx) => tx.category === category)
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    return { name: category, value: total };
  }).filter((item) => item.value > 0);

  const totalIncome = categoryData.reduce((sum, item) => sum + item.value, 0);

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Income</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ₹{totalIncome.toLocaleString('en-IN')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categoryData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No income data yet
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
                  <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
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
                  const percentage = ((entry.payload.value / totalIncome) * 100).toFixed(1);
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
