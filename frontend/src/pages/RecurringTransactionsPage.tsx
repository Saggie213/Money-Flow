import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Calendar, TrendingUp, TrendingDown, Power } from 'lucide-react';
import { useState } from 'react';
import {
  useRecurringTransactions,
  useDeleteRecurringTransaction,
  useToggleRecurringTransaction,
} from '../hooks/useQueries';
import { TransactionType, Frequency, RecurringTransaction } from '../backend';
import RecurringTransactionModal from '../components/RecurringTransactionModal';

export default function RecurringTransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<bigint | null>(null);

  const { data: recurringTransactions = [], isLoading } = useRecurringTransactions();
  const deleteRecurringTransaction = useDeleteRecurringTransaction();
  const toggleRecurringTransaction = useToggleRecurringTransaction();

  const handleEdit = (transaction: RecurringTransaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (id: bigint) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (transactionToDelete !== null) {
      await deleteRecurringTransaction.mutateAsync(transactionToDelete);
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleToggle = async (id: bigint) => {
    await toggleRecurringTransaction.mutateAsync(id);
  };

  const handleAddNew = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

  const getFrequencyLabel = (frequency: Frequency): string => {
    switch (frequency) {
      case Frequency.daily:
        return 'Daily';
      case Frequency.weekly:
        return 'Weekly';
      case Frequency.monthly:
        return 'Monthly';
      case Frequency.yearly:
        return 'Yearly';
      default:
        return 'Unknown';
    }
  };

  const calculateNextDueDate = (transaction: RecurringTransaction): string => {
    if (!transaction.active) return 'Inactive';

    const lastExecution = Number(transaction.lastExecutionDate);
    const startDate = Number(transaction.startDate);
    const now = Date.now() * 1000000;

    let nextDate: number;

    if (lastExecution === 0) {
      nextDate = startDate;
    } else {
      const lastExecutionMs = lastExecution / 1000000;
      const nextDateObj = new Date(lastExecutionMs);

      switch (transaction.frequency) {
        case Frequency.daily:
          nextDateObj.setDate(nextDateObj.getDate() + 1);
          break;
        case Frequency.weekly:
          nextDateObj.setDate(nextDateObj.getDate() + 7);
          break;
        case Frequency.monthly:
          nextDateObj.setMonth(nextDateObj.getMonth() + 1);
          break;
        case Frequency.yearly:
          nextDateObj.setFullYear(nextDateObj.getFullYear() + 1);
          break;
      }

      nextDate = nextDateObj.getTime() * 1000000;
    }

    if (transaction.endDate && nextDate > Number(transaction.endDate)) {
      return 'Ended';
    }

    const nextDateObj = new Date(nextDate / 1000000);
    return nextDateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recurring Transactions</h1>
          <p className="text-muted-foreground">Manage your automatic repeating transactions</p>
        </div>
        <Card className="shadow-lg">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recurring Transactions</h1>
          <p className="text-muted-foreground">Manage your automatic repeating transactions</p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Recurring Transaction
        </Button>
      </div>

      {recurringTransactions.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <span className="text-3xl">🔄</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No Recurring Transactions Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  Set up automatic repeating income and expense entries with configurable frequencies.
                </p>
                <Button
                  onClick={handleAddNew}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Recurring Transaction
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {recurringTransactions.map((transaction) => (
            <Card key={transaction.id.toString()} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.transactionType === TransactionType.income
                          ? 'bg-emerald-100 dark:bg-emerald-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}
                    >
                      {transaction.transactionType === TransactionType.income ? (
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{transaction.category}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{transaction.description || 'No description'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={transaction.active ? 'default' : 'secondary'}>
                      {transaction.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p
                      className={`text-lg font-semibold ${
                        transaction.transactionType === TransactionType.income ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      ₹{Number(transaction.amount).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Frequency</p>
                    <p className="text-lg font-semibold">{getFrequencyLabel(transaction.frequency)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Due</p>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {calculateNextDueDate(transaction)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="text-lg font-semibold capitalize">
                      {transaction.transactionType === TransactionType.income ? 'Income' : 'Expense'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggle(transaction.id)}
                    disabled={toggleRecurringTransaction.isPending}
                  >
                    <Power className="h-4 w-4 mr-1" />
                    {transaction.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(transaction)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <RecurringTransactionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        recurringTransaction={editingTransaction}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recurring Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recurring transaction? This action cannot be undone. Future
              transactions will not be created automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteRecurringTransaction.isPending}
            >
              {deleteRecurringTransaction.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
