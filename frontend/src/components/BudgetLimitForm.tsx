import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useAddBudgetLimit, useGetExpenseCategories } from '../hooks/useQueries';

interface BudgetLimitFormProps {
  onSuccess?: () => void;
}

export default function BudgetLimitForm({ onSuccess }: BudgetLimitFormProps) {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const addBudgetLimit = useAddBudgetLimit();
  const { data: expenseCategories = [] } = useGetExpenseCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !limit) return;

    await addBudgetLimit.mutateAsync({
      category,
      limit: parseFloat(limit),
    });

    setCategory('');
    setLimit('');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="limit">Monthly Limit (₹)</Label>
          <Input
            id="limit"
            type="number"
            placeholder="0"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
        disabled={addBudgetLimit.isPending}
      >
        {addBudgetLimit.isPending ? 'Saving...' : 'Save Budget Limit'}
      </Button>
    </form>
  );
}
