import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm max-w-md ${
          toast.type === 'error'
            ? 'bg-rose-50 text-rose-900 border-rose-200 shadow-rose-100'
            : 'bg-white text-slate-800 border-amber-300 shadow-slate-200'
        }`}
      >
        {toast.type === 'error' ? (
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
        )}
        <span className="font-medium text-xs leading-snug">{toast.message}</span>
      </div>
    </div>
  );
};
