import { Transaction, TransactionType } from '../backend';

export function exportToCSV(transactions: Transaction[]) {
  const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
  
  const rows = transactions.map((tx) => {
    const date = new Date(Number(tx.timestamp) / 1000000);
    const formattedDate = date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const type = tx.transactionType === TransactionType.income ? 'Income' : 'Expense';
    const amount = `₹${Number(tx.amount)}`;
    
    return [formattedDate, type, tx.category, amount, tx.description || ''];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const today = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `transactions_${today}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
