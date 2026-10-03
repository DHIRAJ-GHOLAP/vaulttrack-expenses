import React from 'react';
import {
  Fuel,
  Utensils,
  ShoppingCart,
  Receipt,
  Banknote,
  Sparkles,
  Layers,
  Tag,
  AlertCircle,
  CheckCircle2,
  Settings2,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency, calculatePercentage } from '../utils/formatters';

export function CategoryBudgets({
  categoryStats,
  currencySymbol = '₹',
  onOpenCategoryManager,
}) {
  const getIcon = (name) => {
    switch (name) {
      case 'Bike / Fuel':
        return <Fuel className="w-4 h-4" />;
      case 'Food & Dining':
        return <Utensils className="w-4 h-4" />;
      case 'Groceries':
        return <ShoppingCart className="w-4 h-4" />;
      case 'Bills & Utilities':
        return <Receipt className="w-4 h-4" />;
      case 'Cash Withdrawal':
        return <Banknote className="w-4 h-4" />;
      case 'Personal Care':
        return <Sparkles className="w-4 h-4" />;
      case 'Miscellaneous':
        return <Layers className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Category Budget Limits & Health</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time monthly spending versus allocated caps
          </p>
        </div>

        <button
          onClick={onOpenCategoryManager}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Adjust Limits</span>
        </button>
      </div>

      {/* Grid of Category Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {categoryStats.map((cat) => {
          const pct = calculatePercentage(cat.spent, cat.limit);
          const isOver = cat.isOverBudget;
          const isWarning = !isOver && pct >= 80;

          return (
            <div
              key={cat.id || cat.name}
              className={`relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-2xl p-4 border transition duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${
                isOver
                  ? 'border-rose-400/50 dark:border-rose-500/40 ring-1 ring-rose-500/20'
                  : 'border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              {/* Header: Name, Icon, Badge */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="p-2 rounded-xl text-white flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: cat.color || '#64748b' }}
                    >
                      {getIcon(cat.name)}
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {cat.name}
                    </span>
                  </div>

                  {/* Badges: "Within Limit" (green) or "Over Budget" (red pulse) */}
                  {isOver ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
                      Over Budget
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Within Limit
                    </span>
                  )}
                </div>

                {/* Amounts & Metrics */}
                <div className="mt-3.5 flex items-baseline justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {formatCurrency(cat.spent, currencySymbol)}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-1">spent</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Cap: {formatCurrency(cat.limit, currencySymbol)}
                    </span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver
                        ? 'bg-rose-500'
                        : isWarning
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      backgroundColor: !isOver && !isWarning ? cat.color : undefined,
                    }}
                  />
                </div>
              </div>

              {/* Bottom footer: Remaining or Over limit */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">
                  {pct.toFixed(0)}% consumed
                </span>
                <span
                  className={`font-semibold ${
                    isOver
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isOver
                    ? `+${formatCurrency(Math.abs(cat.remaining), currencySymbol)} over`
                    : `${formatCurrency(cat.remaining, currencySymbol)} left`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
