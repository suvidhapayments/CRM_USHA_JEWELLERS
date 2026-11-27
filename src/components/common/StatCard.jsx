import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  accent = 'gold', // 'gold', 'emerald', 'rose', 'blue', 'purple'
  onClick
}) => {
  const accentConfigs = {
    gold: {
      border: 'hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-200/80',
      valColor: 'text-amber-800',
    },
    emerald: {
      border: 'hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
      valColor: 'text-emerald-800',
    },
    rose: {
      border: 'hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-700 border border-rose-200/80',
      valColor: 'text-rose-800',
    },
    blue: {
      border: 'hover:border-blue-300',
      iconBg: 'bg-blue-50 text-blue-700 border border-blue-200/80',
      valColor: 'text-blue-800',
    },
    purple: {
      border: 'hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-700 border border-purple-200/80',
      valColor: 'text-purple-800',
    }
  };

  const style = accentConfigs[accent] || accentConfigs.gold;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs transition-all duration-200 hover:shadow-md ${style.border} ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${style.iconBg} transition-transform duration-200 group-hover:scale-105`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold ${
                trend === 'up' ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {trendValue}
            </span>
          )}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
