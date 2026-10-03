import { exportDatabaseToJSON } from '../db/db';

/**
 * Downloads a data object as a JSON file
 */
export async function downloadJSONBackup() {
  const data = await exportDatabaseToJSON();
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `expenses-backup-${dateStr}.json`;

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Reads and parses an uploaded JSON file
 * @param {File} file 
 * @returns {Promise<Object>}
 */
export function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (!json || typeof json !== 'object') {
          throw new Error('File does not contain a valid JSON object.');
        }
        resolve(json);
      } catch (err) {
        reject(new Error(`Failed to parse JSON file: ${err.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read the file.'));
    reader.readAsText(file);
  });
}

/**
 * Exports transactions to CSV formatted spreadsheet
 * @param {Array} transactions 
 * @param {string} currencySymbol 
 */
export function downloadCSVExport(transactions, currencySymbol = '₹') {
  if (!transactions || transactions.length === 0) {
    throw new Error('No transactions available to export.');
  }

  // Sort chronologically ascending for the export
  const sorted = [...transactions].sort((a, b) => {
    if (a.date === b.date) {
      return (a.created_at || 0) - (b.created_at || 0);
    }
    return a.date.localeCompare(b.date);
  });

  const headers = ['ID', 'Date', 'Payee / Reason', 'Category', `Amount (${currencySymbol})`, 'Created Timestamp'];
  
  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = sorted.map((tx) => [
    escapeCsv(tx.id),
    escapeCsv(tx.date),
    escapeCsv(tx.reason),
    escapeCsv(tx.category_name),
    escapeCsv(tx.amount),
    escapeCsv(tx.created_at ? new Date(tx.created_at).toISOString() : ''),
  ]);

  const csvContent = [headers.map(escapeCsv).join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  // Add UTF-8 BOM so Excel opens special characters like '₹' correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `expenses-ledger-${dateStr}.csv`;

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
