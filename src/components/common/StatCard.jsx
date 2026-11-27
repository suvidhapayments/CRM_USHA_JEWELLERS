import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  accent = 'blue', // 'blue', 'gold', 'emerald', 'rose', 'purple'
  onClick
}) => {
  const accentConfigs = {
    blue: {
      border: 'hover:border-brand-300',
      iconBg: 'bg-brand-50 text-[#1E65FF] border border-brand-100',
      badgeBg: 'bg-brand-50 text-[#1E65FF]',
    },
    gold: {
      border: 'hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-200/80',
      badgeBg: 'bg-amber-50 text-amber-700',
    },
    emerald: {
      border: 'hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
      badgeBg: 'bg-emerald-50 text-emerald-700',
    },
    rose: {
      border: 'hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-200/80',
      badgeBg: 'bg-rose-50 text-rose-700',
    },
    purple: {
      border: 'hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-200/80',
      badgeBg: 'bg-purple-50 text-purple-700',
    }
  };

  const style = accentConfigs[accent] || accentConfigs.blue;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white border border-[#F1F4F9] rounded-3xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(7,1,39,0.04)] transition-all duration-200 hover:shadow-[0_14px_34px_rgba(7,1,39,0.08)] ${style.border} ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-slate-400 truncate">
            {title}
          </p>
          <h3 className="text-lg sm:text-2xl font-extrabold text-navy-950 mt-1 tracking-tight truncate">
            {value}
          </h3>
        </div>
        <div
          className={`p-2.5 sm:p-3 rounded-2xl ${style.iconBg} transition-transform duration-200 group-hover:scale-110 flex-shrink-0 shadow-2xs`}
        >
          {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
        </div>
      </div>

      {(subtitle || trendValue) && (
        <div className="flex items-center justify-between gap-1.5 mt-3 pt-3 border-t border-slate-100 text-[11px] sm:text-xs">
          {subtitle && (
            <span className="text-slate-500 font-medium truncate">
              {subtitle}
            </span>
          )}
          {trendValue && (
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold text-[10px] sm:text-[11px] ${
                trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-brand-50 text-[#1E65FF]'
              }`}
            >
              {trend === 'up' ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : trend === 'down' ? (
                <ArrowDownRight className="w-3 h-3" />
              ) : null}
              {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
