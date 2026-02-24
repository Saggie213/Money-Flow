import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import FinancialSummary from '../components/FinancialSummary';

export default function SummaryPage() {
  const [period, setPeriod] = useState<'month' | 'year' | 'custom'>('month');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Summary</h1>
          <p className="text-muted-foreground">View your financial performance over time</p>
        </div>
        <div className="w-48">
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Current Month</SelectItem>
              <SelectItem value="year">Current Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <FinancialSummary period={period} />
    </div>
  );
}
