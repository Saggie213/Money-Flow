import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpensePrediction } from '../hooks/useExpensePrediction';
import { TrendingUp } from 'lucide-react';

export default function ExpensePrediction() {
  const { predictedTotal, categoryPredictions, isLoading } = useExpensePrediction();

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Next Month Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (categoryPredictions.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Next Month Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Not enough data for predictions. Add more transactions!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Next Month Prediction</span>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center py-4 border-b border-border">
            <p className="text-sm text-muted-foreground mb-1">Predicted Total Expenses</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              ₹{predictedTotal.toLocaleString('en-IN')}
            </p>
          </div>
          
          <div className="space-y-3">
            {categoryPredictions.map((pred) => (
              <div key={pred.category} className="flex items-center justify-between">
                <span className="text-sm font-medium">{pred.category}</span>
                <span className="text-sm text-muted-foreground">
                  ₹{pred.predicted.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground pt-4 border-t border-border">
            Based on average spending from previous months
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
