import React, { useState, useMemo } from 'react';
import { PieChart, TrendingUp, DollarSign, Award } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function AnalyticsCharts({ categoryStats, totalSpent, currencySymbol = '₹' }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Filter categories that have actual spending
  const activeSpend = useMemo(() => {
    return categoryStats
      .filter((c) => c.spent > 0)
      .sort((a, b) => b.spent - a.spent);
  }, [categoryStats]);

  // Compute donut slices
  const donutData = useMemo(() => {
    if (!totalSpent || totalSpent <= 0 || activeSpend.length === 0) return [];

    let accumulatedAngle = 0;
    const radius = 64;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    return activeSpend.map((cat) => {
      const share = cat.spent / totalSpent;
      const strokeDasharray = `${share * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedAngle * circumference;
      accumulatedAngle += share;

      return {
        ...cat,
        sharePct: (share * 100).toFixed(1),
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [activeSpend, totalSpent]);

  const topCategory = activeSpend[0];

  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Spending Distribution
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Interactive category share breakdown
            </p>
          </div>
        </div>

        {topCategory && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full">
            <Award className="w-3.5 h-3.5" />
            <span>Top: {topCategory.name} ({formatCurrency(topCategory.spent, currencySymbol)})</span>
          </div>
        )}
      </div>

      {activeSpend.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No expense activity logged for this month yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Donut Chart */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="20"
                  className="text-slate-100 dark:text-slate-800"
                />
                {donutData.map((slice) => {
                  const isHovered = hoveredCategory === slice.name;
                  return (
                    <circle
                      key={slice.name}
                      cx="80"
                      cy="80"
                      r="64"
                      fill="transparent"
                      stroke={slice.color || '#64748b'}
                      strokeWidth={isHovered ? 26 : 22}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredCategory(slice.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {hoveredCategory ? hoveredCategory : 'Total Spent'}
                </span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {hoveredCategory
                    ? formatCurrency(
                        donutData.find((d) => d.name === hoveredCategory)?.spent || 0,
                        currencySymbol
                      )
                    : formatCurrency(totalSpent, currencySymbol)}
                </span>
                {hoveredCategory && (
                  <span className="text-[10px] font-semibold text-emerald-500">
                    {donutData.find((d) => d.name === hoveredCategory)?.sharePct}% of total
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="md:col-span-7 space-y-2">
            {donutData.map((item) => {
              const isHovered = hoveredCategory === item.name;
              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setHoveredCategory(item.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex items-center justify-between p-2 rounded-xl border transition cursor-pointer ${
                    isHovered
                      ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 scale-[1.01]'
                      : 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color || '#64748b' }}
                    />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {formatCurrency(item.spent, currencySymbol)}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 min-w-[42px] text-right">
                      {item.sharePct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
