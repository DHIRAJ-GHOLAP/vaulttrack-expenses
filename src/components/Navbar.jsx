import React from 'react';
import { Sun, Moon, Database, Settings2, HardDriveDownload, Calendar, ShieldCheck, Zap } from 'lucide-react';

export function Navbar({
  monthYear,
  currencySymbol,
  isDark,
  onToggleTheme,
  onOpenBalanceModal,
  onOpenCategoryModal,
  onOpenBackupModal,
}) {
  const formattedMonth = (() => {
    try {
      const [year, month] = (monthYear || '2026-10').split('-');
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch (e) {
      return monthYear || 'October 2026';
    }
  })();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Name */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 shadow-md shadow-emerald-500/20 text-white">
              <Zap className="w-5 h-5 fill-white/20" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-slate-950 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  Vault<span className="text-emerald-500">Track</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  IndexedDB
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
                Browser-Native Expense & Budget System
              </p>
            </div>
          </div>

          {/* Center: Month Selector Pill */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onOpenBalanceModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition shadow-sm"
              title="Click to edit budget & currency"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>{formattedMonth}</span>
              <span className="text-slate-400 text-[10px] font-normal">({currencySymbol})</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Category manager button */}
            <button
              onClick={onOpenCategoryModal}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
              title="Manage Categories & Limits"
              aria-label="Manage Categories"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {/* Backup & Portability button */}
            <button
              onClick={onOpenBackupModal}
              className="flex items-center gap-1.5 px-3 py-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-100/80 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold transition shadow-sm"
              title="Backup, Restore & Export CSV/JSON"
            >
              <HardDriveDownload className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Backup</span>
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
