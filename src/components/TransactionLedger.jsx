import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  Edit2,
  Calendar,
  FileSpreadsheet,
  Download,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { formatCurrency, formatDate, getRelativeDateTag } from '../utils/formatters';

export function TransactionLedger({
  transactions = [],
  categories = [],
  currencySymbol = '₹',
  onDeleteTransaction,
  onEditTransaction,
  onExportCSV,
  onNotification,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'amount-desc', 'amount-asc'
  const [dateFilter, setDateFilter] = useState('ALL'); // 'ALL', '2026-10-01', '2026-10-02', '2026-10-03'

  // Map categories for quick color/icon lookup
  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => map.set(c.name, c));
    return map;
  }, [categories]);

  // Unique dates in the ledger for date filter
  const uniqueDates = useMemo(() => {
    const dates = new Set();
    transactions.forEach((tx) => {
      if (tx.date) dates.add(tx.date);
    });
    return Array.from(dates).sort().reverse();
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search query filter (reason or amount)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchReason = tx.reason?.toLowerCase().includes(q);
          const matchCategory = tx.category_name?.toLowerCase().includes(q);
          const matchAmount = tx.amount?.toString().includes(q);
          if (!matchReason && !matchCategory && !matchAmount) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'ALL' && tx.category_name !== selectedCategory) {
          return false;
        }

        // Date filter
        if (dateFilter !== 'ALL' && tx.date !== dateFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          if (a.date === b.date) {
            return (b.created_at || 0) - (a.created_at || 0);
          }
          return b.date.localeCompare(a.date);
        }
        if (sortBy === 'date-asc') {
          if (a.date === b.date) {
            return (a.created_at || 0) - (b.created_at || 0);
          }
          return a.date.localeCompare(b.date);
        }
        if (sortBy === 'amount-desc') {
          return (Number(b.amount) || 0) - (Number(a.amount) || 0);
        }
        if (sortBy === 'amount-asc') {
          return (Number(a.amount) || 0) - (Number(b.amount) || 0);
        }
        return 0;
      });
  }, [transactions, searchQuery, selectedCategory, dateFilter, sortBy]);

  // Filtered total amount
  const filteredTotal = useMemo(() => {
    return filteredTransactions.reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);
  }, [filteredTransactions]);

  const handleDelete = (tx) => {
    onDeleteTransaction(tx.id);
    onNotification({
      type: 'info',
      message: `Deleted "${tx.reason}" (${formatCurrency(tx.amount, currencySymbol)})`,
      undoAction: tx,
    });
  };

  return (
    <section className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md backdrop-blur-sm overflow-hidden">
      {/* Top Header & Search / Filter Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Transaction Ledger
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {filteredTransactions.length} entries
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chronological log with instant search, filter & CSV export
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
              title="Export current ledger to CSV spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Search box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search payee, reason, or amount..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="sm:col-span-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="ALL">All Dates</option>
              {uniqueDates.map((d) => (
                <option key={d} value={d}>
                  {formatDate(d)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Pill */}
        {(selectedCategory !== 'ALL' || dateFilter !== 'ALL' || searchQuery) && (
          <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/40 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-600 dark:text-slate-400">
              Showing {filteredTransactions.length} of {transactions.length} records
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              Subtotal: {formatCurrency(filteredTotal, currencySymbol)}
            </span>
          </div>
        )}
      </div>

      {/* Ledger Table / List */}
      {filteredTransactions.length === 0 ? (
        <div className="py-16 text-center px-4">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            No transactions found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'ALL' || dateFilter !== 'ALL'
              ? 'Try adjusting your search query or filters to find what you are looking for.'
              : 'Start logging your expenses above using the Quick-Add bar!'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4 sm:px-6">Date</th>
                <th className="py-3 px-4">Payee / Merchant</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
              {filteredTransactions.map((tx) => {
                const cat = categoryMap.get(tx.category_name) || {
                  name: tx.category_name,
                  color: '#64748b',
                };

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition duration-150 group"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-slate-200">
                          {getRelativeDateTag(tx.date)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {tx.date}
                        </span>
                      </div>
                    </td>

                    {/* Payee / Merchant / Reason */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color || '#64748b' }}
                        />
                        <span className="font-bold text-slate-900 dark:text-white">
                          {tx.reason}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white shadow-xs"
                        style={{ backgroundColor: cat.color || '#64748b' }}
                      >
                        {tx.category_name}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="font-extrabold text-sm sm:text-base text-rose-600 dark:text-rose-400 font-mono tracking-tight">
                        -{formatCurrency(tx.amount, currencySymbol)}
                      </span>
                    </td>

                    {/* Actions: Edit & Trash */}
                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Total */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm">
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          Total Debits ({filteredTransactions.length} items)
        </span>
        <span className="font-extrabold text-rose-600 dark:text-rose-400 font-mono text-base">
          -{formatCurrency(filteredTotal, currencySymbol)}
        </span>
      </div>
    </section>
  );
}
