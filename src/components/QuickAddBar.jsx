import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check, Calendar, Tag, FileText, Zap, ChevronDown, Sparkles } from 'lucide-react';

export function QuickAddBar({
  categories,
  currencySymbol = '₹',
  recentPayees = [],
  onAddTransaction,
  onNotification,
}) {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(() => {
    // Current date (defaulting to 2026-10-03 or today's ISO date)
    const today = new Date().toISOString().slice(0, 10);
    return today.startsWith('2026') ? today : '2026-10-03';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const amountInputRef = useRef(null);

  // Set default category once categories load
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      // Default to Food & Dining or first category
      const defaultCat = categories.find((c) => c.name === 'Food & Dining') || categories[0];
      setSelectedCategory(defaultCat.name);
    }
  }, [categories, selectedCategory]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      onNotification({
        type: 'error',
        message: 'Please enter an expense amount greater than 0.',
      });
      amountInputRef.current?.focus();
      return;
    }

    if (!reason.trim()) {
      onNotification({
        type: 'error',
        message: 'Please enter a payee, merchant, or note.',
      });
      return;
    }

    const catName = selectedCategory || (categories[0]?.name ?? 'Miscellaneous');

    try {
      setIsSubmitting(true);
      await onAddTransaction({
        amount: parsedAmount,
        category_name: catName,
        reason: reason.trim(),
        date: date || new Date().toISOString().slice(0, 10),
      });

      // Show success feedback
      setJustAdded(true);
      onNotification({
        type: 'success',
        message: `Logged ${currencySymbol}${parsedAmount} for "${reason.trim()}" in ${catName}`,
      });

      // Clear fields
      setAmount('');
      setReason('');

      setTimeout(() => {
        setJustAdded(false);
        setIsSubmitting(false);
        amountInputRef.current?.focus();
      }, 500);
    } catch (err) {
      setIsSubmitting(false);
      onNotification({
        type: 'error',
        message: `Failed to save expense: ${err.message}`,
      });
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-md backdrop-blur-sm transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Zap className="w-4 h-4 fill-emerald-500/20" />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Quick-Add Expense
          </h2>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            3-Sec Logging
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Category Pill Buttons */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Select Category
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  type="button"
                  key={cat.id || cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0 active:scale-95 ${
                    isSelected
                      ? 'text-white shadow-sm ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  style={{
                    backgroundColor: isSelected ? cat.color || '#10b981' : undefined,
                    outlineColor: isSelected ? cat.color || '#10b981' : undefined,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isSelected ? '#ffffff' : cat.color || '#64748b' }}
                  />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Amount Input: Auto-focus numeric keypad on mobile */}
          <div className="sm:col-span-3 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base pointer-events-none">
              {currencySymbol}
            </span>
            <input
              ref={amountInputRef}
              type="number"
              step="any"
              min="0.01"
              inputMode="decimal"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-extrabold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition placeholder:text-slate-400"
            />
          </div>

          {/* Payee / Reason Input with suggestions */}
          <div className="sm:col-span-4 relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Payee / Merchant / Reason (e.g. JSP Petroleum)"
              list="payee-suggestions"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition placeholder:text-slate-400"
            />
            {/* HTML5 datalist for instant zero-overhead auto-complete suggestions */}
            <datalist id="payee-suggestions">
              {recentPayees.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>

          {/* Date Input */}
          <div className="sm:col-span-3 relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
            />
          </div>

          {/* Submit Button with Smooth Animation */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all duration-200 active:scale-95 text-white ${
                justAdded
                  ? 'bg-emerald-500 ring-2 ring-emerald-400'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 animate-scale" />
                  <span>Logged!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Debit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Merchant Tag Pills */}
        {recentPayees.length > 0 && !reason && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Frequent:
            </span>
            {recentPayees.slice(0, 5).map((payee) => (
              <button
                type="button"
                key={payee}
                onClick={() => setReason(payee)}
                className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white px-2 py-0.5 rounded-md transition"
              >
                {payee}
              </button>
            ))}
          </div>
        )}
      </form>
    </section>
  );
}
