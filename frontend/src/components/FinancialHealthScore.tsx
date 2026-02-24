import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinancialSummary } from '../hooks/useFinancialSummary';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function FinancialHealthScore() {
  const { totalIncome, totalExpenses, isLoading } = useFinancialSummary();

  const score = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  
  const getHealthStatus = () => {
    if (score > 30) return { label: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400', icon: TrendingUp };
    if (score > 15) return { label: 'Good', color: 'text-teal-600 dark:text-teal-400', icon: TrendingUp };
    if (score > 0) return { label: 'Fair', color: 'text-yellow-600 dark:text-yellow-400', icon: Minus };
    return { label: 'Poor', color: 'text-red-600 dark:text-red-400', icon: TrendingDown };
  };

  const health = getHealthStatus();
  const Icon = health.icon;

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Financial Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Financial Health Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - Math.max(0, Math.min(100, score)) / 100)}`}
                className={health.color}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${health.color}`}>
                {score.toFixed(0)}%
              </span>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className={`flex items-center justify-center gap-2 ${health.color}`}>
              <Icon className="h-5 w-5" />
              <span className="text-xl font-semibold">{health.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Savings Rate: {score > 0 ? `${score.toFixed(1)}%` : 'No savings'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
