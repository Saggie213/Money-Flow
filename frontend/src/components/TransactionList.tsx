import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { Transaction, TransactionType } from '../backend';
import { useDeleteTransaction } from '../hooks/useQueries';
import { useState } from 'react';
import EditTransactionModal from './EditTransactionModal';

const CATEGORY_ICONS: Record<string, string> = {
  Salary: '/assets/generated/icon-salary.dim_64x64.png',
  Business: '/assets/generated/icon-business.dim_64x64.png',
  Investments: '/assets/generated/icon-investments.dim_64x64.png',
  'Extra income': '/assets/generated/icon-extra-income.dim_64x64.png',
  Deposits: '/assets/generated/icon-deposits.dim_64x64.png',
  Bills: '/assets/generated/icon-bills.dim_64x64.png',
  Car: '/assets/generated/icon-car.dim_64x64.png',
  Clothes: '/assets/generated/icon-clothes.dim_64x64.png',
  Travel: '/assets/generated/icon-travel.dim_64x64.png',
  Shopping: '/assets/generated/icon-shopping.dim_64x64.png',
  House: '/assets/generated/icon-house.dim_64x64.png',
  Entertainment: '/assets/generated/icon-entertainment.dim_64x64.png',
};

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const deleteTransaction = useDeleteTransaction();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const sortedTransactions = [...transactions].sort((a, b) => 
    Number(b.timestamp) - Number(a.timestamp)
  );

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (transactions.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-12 text-center text-muted-foreground">
          No transactions found
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {sortedTransactions.map((transaction) => (
          <Card key={Number(transaction.id)} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  transaction.transactionType === TransactionType.income
                    ? 'bg-emerald-100 dark:bg-emerald-900'
                    : 'bg-red-100 dark:bg-red-900'
                }`}>
                  <img 
                    src={CATEGORY_ICONS[transaction.category] || '/assets/generated/logo.dim_256x256.png'} 
                    alt={transaction.category}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{transaction.category}</p>
                  <p className="text-sm text-muted-foreground truncate">{transaction.description || 'No description'}</p>
                </div>

                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    transaction.transactionType === TransactionType.income
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.transactionType === TransactionType.income ? '+' : '-'}₹{Number(transaction.amount).toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-muted-foreground">{formatDate(transaction.timestamp)}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingTransaction(transaction)}
                    className="h-9 w-9"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTransaction.mutate(transaction.id)}
                    disabled={deleteTransaction.isPending}
                    className="h-9 w-9 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          open={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
        />
      )}
    </>
  );
}
