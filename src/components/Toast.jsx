import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose, onUndo }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-slate-900/95 border-emerald-500/40 text-slate-100 dark:bg-slate-900/95 dark:border-emerald-500/30',
    error: 'bg-slate-900/95 border-rose-500/40 text-slate-100 dark:bg-slate-900/95 dark:border-rose-500/30',
    info: 'bg-slate-900/95 border-blue-500/40 text-slate-100 dark:bg-slate-900/95 dark:border-blue-500/30',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-2xl backdrop-blur-md ${
          bgStyles[toast.type || 'info']
        }`}
      >
        {icons[toast.type || 'info']}
        <div className="flex-1 text-sm font-medium">{toast.message}</div>
        {toast.undoAction && (
          <button
            onClick={() => {
              if (onUndo) onUndo(toast.undoAction);
              onClose();
            }}
            className="text-xs font-semibold px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md transition text-amber-300"
          >
            Undo
          </button>
        )}
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition p-0.5 rounded"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
