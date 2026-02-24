import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import {
  useAddRecurringTransaction,
  useUpdateRecurringTransaction,
  useGetIncomeCategories,
  useGetExpenseCategories,
} from '../hooks/useQueries';
import { TransactionType, Frequency, RecurringTransaction } from '../backend';

interface RecurringTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recurringTransaction?: RecurringTransaction;
}

export default function RecurringTransactionModal({
  open,
  onOpenChange,
  recurringTransaction,
}: RecurringTransactionModalProps) {
  const isEditing = !!recurringTransaction;

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<Frequency>(Frequency.monthly);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDate, setEndDate] = useState('');

  const addRecurringTransaction = useAddRecurringTransaction();
  const updateRecurringTransaction = useUpdateRecurringTransaction();
  const { data: incomeCategories = [] } = useGetIncomeCategories();
  const { data: expenseCategories = [] } = useGetExpenseCategories();

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  useEffect(() => {
    if (recurringTransaction) {
      setType(recurringTransaction.transactionType === TransactionType.income ? 'income' : 'expense');
      setCategory(recurringTransaction.category);
      setAmount(String(recurringTransaction.amount));
      setDescription(recurringTransaction.description);
      setFrequency(recurringTransaction.frequency);
      
      const startDateObj = new Date(Number(recurringTransaction.startDate) / 1000000);
      setStartDate(startDateObj.toISOString().split('T')[0]);
      
      if (recurringTransaction.endDate) {
        setHasEndDate(true);
        const endDateObj = new Date(Number(recurringTransaction.endDate) / 1000000);
        setEndDate(endDateObj.toISOString().split('T')[0]);
      } else {
        setHasEndDate(false);
        setEndDate('');
      }
    } else {
      setType('expense');
      setCategory('');
      setAmount('');
      setDescription('');
      setFrequency(Frequency.monthly);
      setStartDate(new Date().toISOString().split('T')[0]);
      setHasEndDate(false);
      setEndDate('');
    }
  }, [recurringTransaction, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !amount) return;

    const transactionType = type === 'income' ? TransactionType.income : TransactionType.expense;
    const startDateTimestamp = BigInt(new Date(startDate).getTime() * 1000000);
    const endDateTimestamp = hasEndDate && endDate ? BigInt(new Date(endDate).getTime() * 1000000) : null;

    if (isEditing && recurringTransaction) {
      await updateRecurringTransaction.mutateAsync({
        id: recurringTransaction.id,
        category,
        amount: parseFloat(amount),
        description,
        transactionType,
        frequency,
        startDate: startDateTimestamp,
        endDate: endDateTimestamp,
      });
    } else {
      await addRecurringTransaction.mutateAsync({
        category,
        amount: parseFloat(amount),
        description,
        transactionType,
        frequency,
        startDate: startDateTimestamp,
        endDate: endDateTimestamp,
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={type}
              onValueChange={(value: 'income' | 'expense') => {
                setType(value);
                setCategory('');
              }}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={(value) => setFrequency(value as Frequency)}>
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Frequency.daily}>Daily</SelectItem>
                <SelectItem value={Frequency.weekly}>Weekly</SelectItem>
                <SelectItem value={Frequency.monthly}>Monthly</SelectItem>
                <SelectItem value={Frequency.yearly}>Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="hasEndDate" checked={hasEndDate} onCheckedChange={(checked) => setHasEndDate(!!checked)} />
              <Label htmlFor="hasEndDate" className="cursor-pointer">
                Set end date (optional)
              </Label>
            </div>
            {hasEndDate && (
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            disabled={addRecurringTransaction.isPending || updateRecurringTransaction.isPending}
          >
            {addRecurringTransaction.isPending || updateRecurringTransaction.isPending
              ? isEditing
                ? 'Updating...'
                : 'Creating...'
              : isEditing
                ? 'Update'
                : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
