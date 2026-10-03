import React, { useState, useEffect } from 'react';
import { useTracker } from './hooks/useTracker';
import { useTheme } from './hooks/useTheme';
import { initializeDatabase, db } from './db/db';
import { downloadCSVExport } from './utils/exportUtils';

import { Navbar } from './components/Navbar';
import { SummaryDashboard } from './components/SummaryDashboard';
import { QuickAddBar } from './components/QuickAddBar';
import { CategoryBudgets } from './components/CategoryBudgets';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TransactionLedger } from './components/TransactionLedger';

import { EditBalanceModal } from './components/EditBalanceModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { EditTransactionModal } from './components/EditTransactionModal';
import { BackupModal } from './components/BackupModal';
import { Toast } from './components/Toast';

import { ShieldCheck, Cloud, Database, Heart } from 'lucide-react';

export default function App() {
  const { theme, toggleTheme, isDark } = useTheme();

  // Initialize Dexie IndexedDB with seed data on mount
  useEffect(() => {
    initializeDatabase();
  }, []);

  const {
    settings,
    categories,
    transactions,
    openingBalance,
    currencySymbol,
    monthYear,
    totalSpent,
    netRemaining,
    remainingPercent,
    balanceHealth,
    categoryStats,
    bikeStats,
    recentPayees,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateOpeningBalance,
    updateConfig,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useTracker();

  // Modal states
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showNotification = (notif) => {
    setToast(notif);
  };

  const handleUndo = async (undoTx) => {
    if (!undoTx) return;
    try {
      const { id, ...cleanTx } = undoTx;
      await db.transactions.add(cleanTx);
      showNotification({
        type: 'success',
        message: `Restored "${undoTx.reason}" to the ledger!`,
      });
    } catch (err) {
      showNotification({
        type: 'error',
        message: `Failed to restore: ${err.message}`,
      });
    }
  };

  const handleExportCSV = () => {
    try {
      if (!transactions || transactions.length === 0) {
        showNotification({
          type: 'error',
          message: 'No transactions found to export.',
        });
        return;
      }
      downloadCSVExport(transactions, currencySymbol);
      showNotification({
        type: 'success',
        message: `Exported ${transactions.length} transactions to CSV spreadsheet.`,
      });
    } catch (err) {
      showNotification({
        type: 'error',
        message: `Export failed: ${err.message}`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide">
          Loading IndexedDB Storage...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Sticky Header */}
      <Navbar
        monthYear={monthYear}
        currencySymbol={currencySymbol}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenBalanceModal={() => setIsBalanceModalOpen(true)}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Section A: Summary Dashboard */}
        <SummaryDashboard
          openingBalance={openingBalance}
          totalSpent={totalSpent}
          netRemaining={netRemaining}
          balanceHealth={balanceHealth}
          remainingPercent={remainingPercent}
          currencySymbol={currencySymbol}
          bikeStats={bikeStats}
          onOpenEditBalance={() => setIsBalanceModalOpen(true)}
          onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
        />

        {/* Section C: Quick-Add Input Bar */}
        <QuickAddBar
          categories={categories}
          currencySymbol={currencySymbol}
          recentPayees={recentPayees}
          onAddTransaction={addTransaction}
          onNotification={showNotification}
        />

        {/* Category Budget Limits & Health & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Section B: Category Budgets & Health */}
            <CategoryBudgets
              categoryStats={categoryStats}
              currencySymbol={currencySymbol}
              onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
            />
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Spending Distribution Donut Chart */}
            <AnalyticsCharts
              categoryStats={categoryStats}
              totalSpent={totalSpent}
              currencySymbol={currencySymbol}
            />
          </div>
        </div>

        {/* Section D: Transaction Ledger Table & Filters */}
        <TransactionLedger
          transactions={transactions}
          categories={categories}
          currencySymbol={currencySymbol}
          onDeleteTransaction={deleteTransaction}
          onEditTransaction={(tx) => setEditingTransaction(tx)}
          onExportCSV={handleExportCSV}
          onNotification={showNotification}
        />
      </main>

      {/* Footer info & Cloudflare Pages Portability */}
      <footer className="mt-12 border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              IndexedDB (Dexie.js)
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="flex items-center gap-1.5 font-medium">
              <Cloud className="w-3.5 h-3.5 text-orange-500" />
              Cloudflare Pages Ready
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              Zero-Backend & 100% Client-Side
            </span>
          </div>

          <div>
            <span>Data never leaves your browser. Encrypted by local IndexedDB.</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EditBalanceModal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        currentBalance={openingBalance}
        currentCurrency={currencySymbol}
        currentMonthYear={monthYear}
        onSave={(updates) => {
          updateConfig(updates);
          showNotification({
            type: 'success',
            message: 'Monthly budget configuration updated successfully!',
          });
        }}
      />

      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        currencySymbol={currencySymbol}
        onUpdateCategory={(id, updates) => {
          updateCategory(id, updates);
          showNotification({
            type: 'success',
            message: 'Category limit updated!',
          });
        }}
        onAddCategory={(cat) => {
          addCategory(cat);
          showNotification({
            type: 'success',
            message: `Added category "${cat.name}"`,
          });
        }}
        onDeleteCategory={(id) => {
          deleteCategory(id);
          showNotification({
            type: 'info',
            message: 'Category deleted.',
          });
        }}
      />

      <EditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        categories={categories}
        currencySymbol={currencySymbol}
        onSave={(id, updates) => {
          updateTransaction(id, updates);
          showNotification({
            type: 'success',
            message: 'Transaction updated successfully!',
          });
        }}
        onDelete={(id) => {
          deleteTransaction(id);
          showNotification({
            type: 'info',
            message: 'Transaction deleted.',
          });
        }}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        transactions={transactions}
        currencySymbol={currencySymbol}
        onNotification={showNotification}
      />

      {/* Non-intrusive Toast */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
        onUndo={handleUndo}
      />
    </div>
  );
}
