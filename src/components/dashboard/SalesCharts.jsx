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
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl text-xs space-y-1">
        <p className="font-bold text-slate-900 mb-1.5 border-b border-slate-100 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <strong className="font-mono text-slate-900">
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
        <div className="lg:col-span-2 h-80 bg-slate-200/60 rounded-2xl" />
        <div className="h-80 bg-slate-200/60 rounded-2xl" />
      </div>
    );
  }

  const { monthlyOverview, paidVsOutstanding } = metrics.charts;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1 & 2 & 3. Monthly Trends: Sales, Collections & Gold Weight */}
      <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Monthly Sales & Collections Performance
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Financial trends and gold volume sold over recent months
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setSalesMetricTab('sales_vs_collections')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                salesMetricTab === 'sales_vs_collections'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sales vs Collections (₹)
            </button>
            <button
              onClick={() => setSalesMetricTab('gold_grams')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                salesMetricTab === 'gold_grams'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gold Volume (Grams)
            </button>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-72 w-full">
          {salesMetricTab === 'sales_vs_collections' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyOverview} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="collectionsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                />
                <Tooltip content={<CustomTooltip unit="₹" />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="Sales Revenue"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="collections"
                  name="Cash & Bank Collections"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#collectionsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyOverview} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}g`}
                />
                <Tooltip content={<CustomTooltip unit="g" />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  iconType="circle"
                />
                <Bar
                  dataKey="goldGrams"
                  name="Pure Gold Net Weight (grams)"
                  fill="#d97706"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 4. Paid vs Outstanding Amounts (Donut Chart) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-600" />
            Paid vs Outstanding Amounts
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Realized cash collection vs pending credit
          </p>
        </div>

        <div className="h-56 relative flex items-center justify-center my-2">
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
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => formatCurrency(val)}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text in donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-bold text-slate-400">Recovery</span>
            <span className="text-lg font-bold text-emerald-600 font-mono">
              {paidVsOutstanding[0].value + paidVsOutstanding[1].value > 0
                ? `${Math.round((paidVsOutstanding[0].value / (paidVsOutstanding[0].value + paidVsOutstanding[1].value)) * 100)}%`
                : '100%'}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Amount Received
            </span>
            <strong className="font-mono text-emerald-700">
              {formatCurrency(paidVsOutstanding[0].value)}
            </strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Outstanding Balance
            </span>
            <strong className="font-mono text-rose-700">
              {formatCurrency(paidVsOutstanding[1].value)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
