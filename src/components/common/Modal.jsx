import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div 
        className={`relative w-full ${maxWidth} bg-white border border-[#F1F4F9] rounded-3xl shadow-[0_20px_60px_-15px_rgba(7,1,39,0.25)] overflow-hidden z-10 animate-in zoom-in-95 duration-150 my-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-100 bg-[#FBFBFD]">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-navy-950 flex items-center gap-2 tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-navy-950 rounded-full hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto text-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
};
