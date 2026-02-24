import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { useState } from 'react';
import AddTransactionModal from '../components/AddTransactionModal';
import TransactionList from '../components/TransactionList';
import TransactionFilters from '../components/TransactionFilters';
import { useTransactionFilters } from '../hooks/useTransactionFilters';
import { exportToCSV } from '../utils/csvExport';
import { useGetAllTransactions } from '../hooks/useQueries';

export default function TransactionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: allTransactions = [] } = useGetAllTransactions();
  const { filteredTransactions, setFilters, filters } = useTransactionFilters(allTransactions);

  const handleExport = () => {
    exportToCSV(filteredTransactions);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">View and manage all your transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionFilters filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      <TransactionList transactions={filteredTransactions} />

      <AddTransactionModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
    </div>
  );
}
