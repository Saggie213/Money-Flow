import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const ALL_CATEGORIES = [
  'Salary', 'Business', 'Investments', 'Extra income', 'Deposits',
  'Bills', 'Car', 'Clothes', 'Travel', 'Shopping', 'House', 'Entertainment'
];

interface TransactionFiltersProps {
  filters: {
    type: 'all' | 'income' | 'expense';
    category: string;
    dateFrom: string;
    dateTo: string;
    searchAmount: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function TransactionFilters({ filters, onFiltersChange }: TransactionFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      type: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      searchAmount: '',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={filters.type} onValueChange={(value) => onFiltersChange({ ...filters, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {ALL_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>From Date</Label>
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>To Date</Label>
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Amount</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Search amount"
            value={filters.searchAmount}
            onChange={(e) => onFiltersChange({ ...filters, searchAmount: e.target.value })}
          />
          <Button variant="outline" size="icon" onClick={handleReset}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
