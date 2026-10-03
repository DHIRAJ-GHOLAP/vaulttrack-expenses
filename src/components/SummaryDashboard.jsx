import React from 'react';
import { Wallet, TrendingDown, Sparkles, Fuel, Edit3, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency, calculatePercentage } from '../utils/formatters';

export function SummaryDashboard({
  openingBalance,
  totalSpent,
  netRemaining,
  balanceHealth,
  remainingPercent,
  currencySymbol = '₹',
  bikeStats,
  onOpenEditBalance,
  onOpenCategoryManager,
}) {
  // Determine styles for Net Remaining based on balanceHealth
  const healthConfig = {
    healthy: {
      textColor: 'text-emerald-500 dark:text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      badgeLabel: 'Healthy Surplus',
      glow: 'shadow-emerald-500/5',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    },
    low: {
      textColor: 'text-amber-500 dark:text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      badgeLabel: 'Low Runway (<20%)',
      glow: 'shadow-amber-500/5',
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    },
    negative: {
      textColor: 'text-rose-500 dark:text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse',
      badgeLabel: 'Overdrawn!',
      glow: 'shadow-rose-500/10',
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
    },
  }[balanceHealth];

  // Bike cap metrics
  const bikeLimit = bikeStats?.limit || 3000;
  const bikeSpent = bikeStats?.spent || 0;
  const bikeRemaining = bikeLimit - bikeSpent;
  const bikePct = calculatePercentage(bikeSpent, bikeLimit);
  const isBikeOver = bikeSpent > bikeLimit;

  return (
    <section className="space-y-4">
      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Opening Balance Card */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Opening Balance
              </span>
            </div>
            {/* Inline edit button */}
            <button
              onClick={onOpenEditBalance}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Edit opening balance & currency"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(openingBalance, currencySymbol)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Monthly Allocation</span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-400" />
              <button
                onClick={onOpenEditBalance}
                className="text-blue-500 hover:underline font-medium"
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Total Spent Card */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
                <TrendingDown className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Spent
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              Debits
            </span>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400">
              {formatCurrency(totalSpent, currencySymbol)}
            </div>
            <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>
                {openingBalance > 0
                  ? `${((totalSpent / openingBalance) * 100).toFixed(1)}% of total budget`
                  : 'All debits calculated'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Net Remaining Balance Card */}
        <div className={`relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between ${healthConfig.glow}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2.5 rounded-xl ${healthConfig.badgeBg}`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Net Remaining
              </span>
            </div>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${healthConfig.badgeBg}`}>
              {healthConfig.icon}
              {healthConfig.badgeLabel}
            </span>
          </div>

          <div className="mt-4">
            <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${healthConfig.textColor}`}>
              {formatCurrency(netRemaining, currencySymbol)}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Available Runway</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {remainingPercent}% left
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Dedicated Bike Cap Meter Card */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
                <Fuel className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Bike Cap Meter
                </span>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isBikeOver
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'
                  : bikePct > 80
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              }`}
            >
              {isBikeOver ? 'Cap Exceeded' : `${bikePct.toFixed(0)}% Used`}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(bikeSpent, currencySymbol)}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Limit: {formatCurrency(bikeLimit, currencySymbol)}
              </span>
            </div>

            {/* Specialized Bike Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2 relative">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isBikeOver
                    ? 'bg-gradient-to-r from-rose-500 to-red-600'
                    : bikePct > 80
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-orange-400 to-amber-500'
                }`}
                style={{ width: `${Math.min(bikePct, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              <span>{isBikeOver ? 'Over budget by' : 'Remaining allowance'}</span>
              <span className={`font-semibold ${isBikeOver ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                {isBikeOver
                  ? formatCurrency(Math.abs(bikeRemaining), currencySymbol)
                  : `${formatCurrency(bikeRemaining, currencySymbol)} left`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
