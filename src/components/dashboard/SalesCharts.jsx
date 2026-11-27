import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatWeight } from '../../utils/formatters';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react';

const CustomTooltip = ({ active, payload, label, unit = '₹' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#F1F4F9] p-3.5 rounded-2xl shadow-[0_10px_30px_rgba(7,1,39,0.1)] text-xs space-y-1">
        <p className="font-extrabold text-navy-950 mb-1.5 border-b border-slate-100 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <strong className="font-mono font-bold text-navy-950">
              {unit === '₹' ? formatCurrency(entry.value) : formatWeight(entry.value)}
            </strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const SalesCharts = () => {
  const { metrics } = useApp();
  const [salesMetricTab, setSalesMetricTab] = useState('sales_vs_collections'); // 'sales_vs_collections' or 'gold_grams'

  if (!metrics || !metrics.charts) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        <div className="lg:col-span-2 h-88 bg-slate-200/50 rounded-3xl" />
        <div className="h-88 bg-slate-200/50 rounded-3xl" />
      </div>
    );
  }

  const { monthlyOverview, paidVsOutstanding } = metrics.charts;

  // Custom colors matching the design: Midnight Navy (#070127) for Sales Done/Paid, Electric Blue (#1E65FF) for Outstanding
  const pieColors = ['#070127', '#1E65FF'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Report: Spline Curve Chart matching Image 1 & 3 */}
      <div className="lg:col-span-2 glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1E65FF]" />
              <h3 className="text-base sm:text-lg font-extrabold text-navy-950 tracking-tight">
                Monthly Performance Report
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Sales, collections and gold weight volume over recent months
            </p>
          </div>

          {/* Pill Switcher */}
          <div className="flex items-center gap-1 bg-[#F4F6FB] p-1 rounded-full border border-slate-200/70 text-xs">
            <button
              onClick={() => setSalesMetricTab('sales_vs_collections')}
              className={`px-4 py-1.5 rounded-full font-bold transition-all ${
                salesMetricTab === 'sales_vs_collections'
                  ? 'bg-[#1E65FF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-navy-950'
              }`}
            >
              Sales vs Collections
            </button>
            <button
              onClick={() => setSalesMetricTab('gold_grams')}
              className={`px-4 py-1.5 rounded-full font-bold transition-all ${
                salesMetricTab === 'gold_grams'
                  ? 'bg-[#1E65FF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-navy-950'
              }`}
            >
              Gold Volume (g)
            </button>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-72 w-full">
          {salesMetricTab === 'sales_vs_collections' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyOverview} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E65FF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1E65FF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="navyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#070127" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#070127" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F4F9" />
                <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#E2E8F0' }} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip unit="₹" />} />
                <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="sales" name="Sales (₹)" stroke="#1E65FF" strokeWidth={3} fill="url(#blueGradient)" activeDot={{ r: 6, fill: '#1E65FF', stroke: '#ffffff', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="collections" name="Collections (₹)" stroke="#070127" strokeWidth={2.5} fill="url(#navyGradient)" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyOverview} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F4F9" />
                <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#E2E8F0' }} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(val) => `${val}g`} />
                <Tooltip content={<CustomTooltip unit="g" />} />
                <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
                <Bar dataKey="gold_sold_grams" name="Gold Sold (Grams)" fill="#1E65FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Sales Stat: Donut Chart matching Image 1 & 3 */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-extrabold text-navy-950 tracking-tight">
              Sales Stat
            </h3>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              Recovery Ratio
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Keep your info updated to increase the collection rate
          </p>
        </div>

        <div className="h-56 w-full flex items-center justify-center relative my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paidVsOutstanding}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {paidVsOutstanding.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip unit="₹" />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Paid Rate</span>
            <span className="text-xl font-extrabold text-navy-950">86.7%</span>
          </div>
        </div>

        {/* Legend pills matching the reference image */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-medium text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-navy-950" />
              Paid / Cleared
            </span>
            <span className="font-mono font-bold text-navy-950">
              {formatCurrency(paidVsOutstanding[0]?.value || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-medium text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E65FF]" />
              Outstanding Due
            </span>
            <span className="font-mono font-bold text-[#1E65FF]">
              {formatCurrency(paidVsOutstanding[1]?.value || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
