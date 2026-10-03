import { useLiveQuery } from 'dexie-react-hooks';
import { db, initializeDatabase } from '../db/db';
import { useMemo } from 'react';

export function useTracker() {
  // Reactive query for settings
  const settings = useLiveQuery(
    () => db.settings.get('monthly_config'),
    [],
    null
  );

  // Reactive query for categories
  const categories = useLiveQuery(
    () => db.categories.toArray(),
    [],
    []
  );

  // Reactive query for transactions
  const transactions = useLiveQuery(
    () => db.transactions.toArray(),
    [],
    []
  );

  // Computed values
  const openingBalance = settings?.opening_balance ?? 36000;
  const currencySymbol = settings?.currency_symbol ?? '₹';
  const monthYear = settings?.month_year ?? '2026-10';

  const totalSpent = useMemo(() => {
    if (!transactions) return 0;
    return transactions.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  }, [transactions]);

  const netRemaining = openingBalance - totalSpent;

  const remainingPercent = useMemo(() => {
    if (openingBalance <= 0) return 0;
    return Math.max(0, Math.round((netRemaining / openingBalance) * 100));
  }, [openingBalance, netRemaining]);

  const balanceHealth = useMemo(() => {
    if (netRemaining < 0) return 'negative'; // Overdrawn
    if (netRemaining <= openingBalance * 0.2) return 'low'; // Low warning (< 20%)
    return 'healthy'; // Healthy (> 20%)
  }, [netRemaining, openingBalance]);

  // Aggregate spending per category
  const categoryStats = useMemo(() => {
    if (!categories) return [];

    const spendMap = {};
    if (transactions) {
      for (const tx of transactions) {
        const cat = tx.category_name || 'Miscellaneous';
        spendMap[cat] = (spendMap[cat] || 0) + (Number(tx.amount) || 0);
      }
    }

    return categories.map((cat) => {
      const spent = spendMap[cat.name] || 0;
      const limit = Number(cat.monthly_limit) || 0;
      const remaining = limit - spent;
      const percent = limit > 0 ? (spent / limit) * 100 : 0;
      const isOverBudget = limit > 0 && spent > limit;

      return {
        ...cat,
        spent,
        limit,
        remaining,
        percent,
        isOverBudget,
      };
    });
  }, [categories, transactions]);

  // Dedicated Bike Cap Meter stats
  const bikeStats = useMemo(() => {
    const bikeCat = categoryStats.find((c) => c.name === 'Bike / Fuel') || {
      name: 'Bike / Fuel',
      spent: 0,
      limit: 3000,
      remaining: 3000,
      percent: 0,
      isOverBudget: false,
      color: '#f97316',
    };
    return bikeCat;
  }, [categoryStats]);

  // Recent payees/merchants for instant auto-complete suggestions
  const recentPayees = useMemo(() => {
    if (!transactions) return [];
    const map = new Map();
    // Count frequency
    transactions.forEach((tx) => {
      if (tx.reason) {
        map.set(tx.reason, (map.get(tx.reason) || 0) + 1);
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
      .slice(0, 10);
  }, [transactions]);

  // Mutations
  const addTransaction = async ({ date, category_name, amount, reason }) => {
    return await db.transactions.add({
      date: date || new Date().toISOString().slice(0, 10),
      category_name: category_name || 'Miscellaneous',
      amount: parseFloat(amount) || 0,
      reason: reason ? reason.trim() : 'Expense',
      created_at: Date.now(),
    });
  };

  const updateTransaction = async (id, updates) => {
    if (updates.amount !== undefined) {
      updates.amount = parseFloat(updates.amount) || 0;
    }
    if (updates.reason !== undefined) {
      updates.reason = updates.reason.trim();
    }
    return await db.transactions.update(id, updates);
  };

  const deleteTransaction = async (id) => {
    return await db.transactions.delete(id);
  };

  const updateOpeningBalance = async (newBalance) => {
    const balanceNum = parseFloat(newBalance) || 0;
    return await db.settings.put({
      key: 'monthly_config',
      opening_balance: balanceNum,
      currency_symbol: currencySymbol,
      month_year: monthYear,
    });
  };

  const updateConfig = async (updates) => {
    const current = settings || {
      key: 'monthly_config',
      opening_balance: 36000,
      currency_symbol: '₹',
      month_year: '2026-10',
    };
    return await db.settings.put({
      ...current,
      ...updates,
    });
  };

  const addCategory = async ({ name, monthly_limit, color, icon }) => {
    return await db.categories.add({
      name: name.trim(),
      monthly_limit: parseFloat(monthly_limit) || 0,
      color: color || '#64748b',
      icon: icon || 'Tag',
    });
  };

  const updateCategory = async (id, updates) => {
    if (updates.monthly_limit !== undefined) {
      updates.monthly_limit = parseFloat(updates.monthly_limit) || 0;
    }
    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
    }
    return await db.categories.update(id, updates);
  };

  const deleteCategory = async (id) => {
    return await db.categories.delete(id);
  };

  return {
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
    isLoading: settings === undefined || categories === undefined || transactions === undefined,
    // Actions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateOpeningBalance,
    updateConfig,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
