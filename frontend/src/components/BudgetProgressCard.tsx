import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useDeleteBudgetLimit } from '../hooks/useQueries';

interface BudgetProgressCardProps {
  category: string;
  limit: number;
  spent: number;
}

export default function BudgetProgressCard({ category, limit, spent }: BudgetProgressCardProps) {
  const deleteBudgetLimit = useDeleteBudgetLimit();
  const percentage = (spent / limit) * 100;
  const remaining = limit - spent;

  const getColorClass = () => {
    if (percentage >= 100) return 'text-red-600 dark:text-red-400';
    if (percentage >= 90) return 'text-orange-600 dark:text-orange-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  const getProgressColorClass = () => {
    if (percentage >= 100) return 'progress-red';
    if (percentage >= 90) return 'progress-orange';
    if (percentage >= 70) return 'progress-yellow';
    return 'progress-emerald';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{category}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteBudgetLimit.mutate(category)}
          disabled={deleteBudgetLimit.isPending}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent</span>
            <span className={`font-semibold ${getColorClass()}`}>
              ₹{spent.toLocaleString('en-IN')} / ₹{limit.toLocaleString('en-IN')}
            </span>
          </div>
          <Progress value={Math.min(percentage, 100)} className={`h-2 ${getProgressColorClass()}`} />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {percentage >= 100 ? 'Over budget' : 'Remaining'}
            </span>
            <span className={`font-semibold ${getColorClass()}`}>
              {percentage >= 100 ? '+' : ''}₹{Math.abs(remaining).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            {percentage.toFixed(1)}% of budget used
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
