import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useUpdateTransaction, useGetIncomeCategories, useGetExpenseCategories } from '../hooks/useQueries';
import { Transaction, TransactionType } from '../backend';
import { useBudgetNotifications } from '../hooks/useBudgetNotifications';

interface EditTransactionModalProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditTransactionModal({ transaction, open, onOpenChange }: EditTransactionModalProps) {
  const [category, setCategory] = useState(transaction.category);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [description, setDescription] = useState(transaction.description);

  const updateTransaction = useUpdateTransaction();
  const { checkBudgetExceeded } = useBudgetNotifications();
  const { data: incomeCategories = [] } = useGetIncomeCategories();
  const { data: expenseCategories = [] } = useGetExpenseCategories();

  const categories = transaction.transactionType === TransactionType.income ? incomeCategories : expenseCategories;

  useEffect(() => {
    setCategory(transaction.category);
    setAmount(String(transaction.amount));
    setDescription(transaction.description);
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount) return;

    const newAmount = parseFloat(amount);
    const oldAmount = Number(transaction.amount);

    await updateTransaction.mutateAsync({
      id: transaction.id,
      amount: newAmount,
      category,
      description,
    });

    if (transaction.transactionType === TransactionType.expense) {
      const amountDiff = newAmount - oldAmount;
      if (amountDiff > 0) {
        checkBudgetExceeded(category, amountDiff);
      }
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue />
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            disabled={updateTransaction.isPending}
          >
            {updateTransaction.isPending ? 'Updating...' : 'Update'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
