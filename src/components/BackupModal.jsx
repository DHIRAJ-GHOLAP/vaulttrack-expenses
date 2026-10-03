import React, { useState, useRef } from 'react';
import { X, Download, Upload, FileSpreadsheet, RotateCcw, Trash2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { downloadJSONBackup, readJSONFile, downloadCSVExport } from '../utils/exportUtils';
import { resetDatabaseToSeed, wipeDatabase, importDatabaseFromJSON } from '../db/db';

export function BackupModal({
  isOpen,
  onClose,
  transactions,
  currencySymbol = '₹',
  onNotification,
}) {
  const [importMode, setImportMode] = useState('replace');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleExportJSON = async () => {
    try {
      setIsProcessing(true);
      await downloadJSONBackup();
      onNotification({
        type: 'success',
        message: 'JSON backup downloaded successfully!',
      });
    } catch (err) {
      onNotification({
        type: 'error',
        message: `Failed to download JSON backup: ${err.message}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportCSV = () => {
    try {
      if (!transactions || transactions.length === 0) {
        onNotification({
          type: 'error',
          message: 'No transactions found to export to CSV.',
        });
        return;
      }
      downloadCSVExport(transactions, currencySymbol);
      onNotification({
        type: 'success',
        message: `Exported ${transactions.length} transactions to CSV spreadsheet.`,
      });
    } catch (err) {
      onNotification({
        type: 'error',
        message: `CSV Export failed: ${err.message}`,
      });
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    try {
      setIsProcessing(true);
      const data = await readJSONFile(file);
      await importDatabaseFromJSON(data, importMode);
      onNotification({
        type: 'success',
        message: `Backup imported successfully (${importMode === 'replace' ? 'replaced all data' : 'merged data'})!`,
      });
      onClose();
    } catch (err) {
      onNotification({
        type: 'error',
        message: `Import failed: ${err.message}`,
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleResetSeed = async () => {
    if (window.confirm('Reset database to October 2026 default seed data? All custom entries will be replaced.')) {
      try {
        setIsProcessing(true);
        await resetDatabaseToSeed();
        onNotification({
          type: 'success',
          message: 'Database reset to October 2026 seed state.',
        });
        onClose();
      } catch (err) {
        onNotification({
          type: 'error',
          message: `Failed to reset: ${err.message}`,
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleWipe = async () => {
    if (window.confirm('Are you sure you want to wipe all transaction records? This action cannot be undone unless you have a backup.')) {
      try {
        setIsProcessing(true);
        await wipeDatabase();
        onNotification({
          type: 'info',
          message: 'All transaction history cleared.',
        });
        onClose();
      } catch (err) {
        onNotification({
          type: 'error',
          message: `Failed to clear data: ${err.message}`,
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Backup & Portability
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              100% Client-Side. Export, import, or spreadsheet download.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Export section */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Export Your Data
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExportJSON}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition active:scale-95"
              >
                <Download className="w-4 h-4 text-emerald-500" />
                Download JSON Backup
              </button>
              <button
                onClick={handleExportCSV}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition active:scale-95"
              >
                <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                Export CSV Spreadsheet
              </button>
            </div>
          </div>

          {/* Import section */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Restore From JSON Backup
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="text-emerald-500 focus:ring-emerald-400"
                  />
                  <span>Replace All</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="radio"
                    name="importMode"
                    value="merge"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                    className="text-emerald-500 focus:ring-emerald-400"
                  />
                  <span>Merge</span>
                </label>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              className="hidden"
            />

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500/50 bg-white dark:bg-slate-900'
              }`}
            >
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Click to browse or drop your <span className="font-mono text-emerald-500 font-bold">.json</span> backup file
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Restores settings, categories, and all transactions
              </p>
            </div>
          </div>

          {/* Database Maintenance */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Database Maintenance
            </h4>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={handleResetSeed}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to Seed (Oct 2026)
              </button>
              <button
                onClick={handleWipe}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
