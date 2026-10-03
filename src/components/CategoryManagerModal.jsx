import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Check, AlertCircle, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  currencySymbol = '₹',
  onUpdateCategory,
  onAddCategory,
  onDeleteCategory,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editLimit, setEditLimit] = useState('');
  const [editName, setEditName] = useState('');
  
  // New category state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [newColor, setNewColor] = useState('#3b82f6');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const colorPalette = [
    '#f97316', '#ef4444', '#10b981', '#3b82f6', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#eab308', '#64748b'
  ];

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditLimit(cat.monthly_limit.toString());
    setError('');
  };

  const handleSaveEdit = (catId) => {
    const limit = parseFloat(editLimit);
    if (isNaN(limit) || limit < 0) {
      setError('Please enter a valid monthly limit.');
      return;
    }
    onUpdateCategory(catId, {
      name: editName.trim(),
      monthly_limit: limit,
    });
    setEditingId(null);
    setError('');
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError('Category name is required.');
      return;
    }
    const limit = parseFloat(newLimit);
    if (isNaN(limit) || limit < 0) {
      setError('Please enter a valid monthly budget limit.');
      return;
    }

    onAddCategory({
      name: newName.trim(),
      monthly_limit: limit,
      color: newColor,
    });

    setNewName('');
    setNewLimit('');
    setShowAddForm(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Category Budgets & Limits
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize monthly spending allowances
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex-shrink-0">
            {error}
          </div>
        )}

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {categories.map((cat) => {
            const isEditing = editingId === cat.id;

            return (
              <div
                key={cat.id || cat.name}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl flex items-center justify-between gap-3 transition"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color || '#64748b' }}
                  />
                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-1/2 px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                      />
                      <div className="relative w-1/2">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                          {currencySymbol}
                        </span>
                        <input
                          type="number"
                          value={editLimit}
                          onChange={(e) => setEditLimit(e.target.value)}
                          className="w-full pl-6 pr-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-semibold"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="truncate">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {cat.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(cat.id)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg transition"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                        {formatCurrency(cat.monthly_limit, currencySymbol)}
                      </span>
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        title="Edit Limit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {categories.length > 3 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete category "${cat.name}"? Transactions won't be deleted.`)) {
                              onDeleteCategory(cat.id);
                            }
                          }}
                          className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add new category accordion */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 px-3 border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-500 flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Add Custom Category
            </button>
          ) : (
            <form onSubmit={handleAddSubmit} className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  New Category Details
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Category Name"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder={`Monthly Limit (${currencySymbol})`}
                  required
                  min="0"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                  Tag Color
                </label>
                <div className="flex items-center gap-1.5">
                  {colorPalette.map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => setNewColor(color)}
                      className={`w-5 h-5 rounded-full border-2 transition ${
                        newColor === color ? 'border-white scale-110 shadow-sm' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
              >
                Create Category
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
