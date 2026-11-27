import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    gold: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
    rose: 'bg-rose-50 text-rose-800 border-rose-200 font-semibold',
    blue: 'bg-blue-50 text-blue-800 border-blue-200 font-semibold',
    purple: 'bg-purple-50 text-purple-800 border-purple-200 font-semibold',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {children}
    </span>
  );
};
