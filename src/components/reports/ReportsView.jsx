import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { formatCurrency, formatMobile, formatWeight } from '../../utils/formatters';
import {
  FileBarChart2,
  Download,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Receipt,
  Sparkles,
  TrendingUp,
  Scale
} from 'lucide-react';

export const ReportsView = () => {
  const { customers, sales, openAddPaymentForCustomer } = useApp();
  const [dateRange, setDateRange] = useState('all');

  const filteredSales = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.slice(0, 7);

    return sales.filter((s) => {
      const sDate = s.sale_date || s.created_at;
      if (dateRange === 'today') return sDate.startsWith(today);
      if (dateRange === 'month') return sDate.startsWith(currentMonth);
      return true;
    });
  }, [sales, dateRange]);

  const totalSalesVal = filteredSales.reduce((acc, s) => acc + Number(s.final_amount || 0), 0);
  const totalGoldWeight = filteredSales.reduce((acc, s) => acc + Number(s.total_net_weight || s.total_gross_weight || 0), 0);
  const totalPaidVal = filteredSales.reduce((acc, s) => acc + Number(s.paid_amount || 0), 0);
  const totalOutstanding = filteredSales.reduce((acc, s) => acc + Number(s.balance_amount || 0), 0);
  const avgBillSize = filteredSales.length > 0 ? Math.round(totalSalesVal / filteredSales.length) : 0;

  const debtors = customers
    .filter((c) => Number(c.outstanding_balance || 0) > 0)
    .sort((a, b) => Number(b.outstanding_balance) - Number(a.outstanding_balance));

  const categoryMap = {};
  filteredSales.forEach((s) => {
    s.items?.forEach((item) => {
      const cat = item.category || 'Jewellery';
      if (!categoryMap[cat]) categoryMap[cat] = { count: 0, weight: 0, total: 0 };
      categoryMap[cat].count += 1;
      categoryMap[cat].weight += Number(item.net_weight || item.gross_weight || 0);
      categoryMap[cat].total += Number(item.item_total || 0);
    });
  });

  const categoryList = Object.entries(categoryMap).map(([name, data]) => ({
    name,
    ...data
  }));

  const handleExportAging = () => {
    const headers = ['Customer ID', 'Customer Name', 'Mobile', 'Address', 'Total Purchases', 'Amount Paid', 'Outstanding Balance'];
    const rows = debtors.map((d) => [
      d.customer_code,
      `"${d.name}"`,
      d.mobile,
      `"${d.address?.replace(/"/g, '""')}"`,
      d.total_purchased,
      d.total_paid,
      d.outstanding_balance
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `usha_jewellers_outstanding_debtors_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#F1F4F9] p-5 sm:p-6 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 flex items-center gap-2 tracking-tight">
            <FileBarChart2 className="w-6 h-6 text-[#1E65FF]" />
            Sales, Bullion & Outstanding Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Audit summary, category volume, and debtor aging for Usha Jewellers
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F4F6FB] p-1 rounded-full border border-slate-200/70 text-xs">
          <button
            onClick={() => setDateRange('all')}
            className={`px-4 py-1.5 rounded-full font-bold transition-all ${
              dateRange === 'all' ? 'bg-[#1E65FF] text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-4 py-1.5 rounded-full font-bold transition-all ${
              dateRange === 'month' ? 'bg-[#1E65FF] text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setDateRange('today')}
            className={`px-4 py-1.5 rounded-full font-bold transition-all ${
              dateRange === 'today' ? 'bg-[#1E65FF] text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            Today
          </button>
        </div>
      </div>

      {/* Key Metric Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
          <span className="text-xs font-bold uppercase text-slate-400">Total Billed</span>
          <p className="text-2xl font-extrabold text-navy-950 mt-1">{formatCurrency(totalSalesVal)}</p>
          <span className="text-xs text-slate-500 mt-0.5 block font-medium">{filteredSales.length} total bills</span>
        </div>

        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
          <span className="text-xs font-bold uppercase text-slate-400">Gold Weight Sold</span>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{formatWeight(totalGoldWeight)}</p>
          <span className="text-xs text-slate-500 mt-0.5 block font-medium">Net Hallmarked Gold</span>
        </div>

        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
          <span className="text-xs font-bold uppercase text-slate-400">Collections</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{formatCurrency(totalPaidVal)}</p>
          <span className="text-xs text-emerald-600 mt-0.5 block font-medium">Realized revenue</span>
        </div>

        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
          <span className="text-xs font-bold uppercase text-slate-400">Avg Ticket Size</span>
          <p className="text-2xl font-extrabold text-[#1E65FF] mt-1">{formatCurrency(avgBillSize)}</p>
          <span className="text-xs text-slate-500 mt-0.5 block font-medium">Per invoice average</span>
        </div>
      </div>

      {/* Outstanding Aging Ledger (Debtors Table) */}
      <div className="bg-white border border-[#F1F4F9] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-navy-950 flex items-center gap-2 tracking-tight">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Outstanding Credit & Aging Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Customers with pending installment balances ranked by highest balance
            </p>
          </div>

          <button
            onClick={handleExportAging}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-navy-950 text-xs font-bold border border-slate-200/70 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Aging Sheet
          </button>
        </div>

        {debtors.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-[#F8FAFC] rounded-2xl">
            <CheckCircle className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <p className="font-extrabold text-navy-950">All customer dues are completely cleared!</p>
            <p className="text-xs text-slate-500 mt-0.5">Zero outstanding balances recorded.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAFC] text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-3.5 rounded-l-xl">Customer</th>
                  <th className="py-3 px-3.5">Mobile</th>
                  <th className="py-3 px-3.5">Address</th>
                  <th className="py-3 px-3.5 text-right">Total Purchases</th>
                  <th className="py-3 px-3.5 text-right">Amount Paid</th>
                  <th className="py-3 px-3.5 text-right">Balance Due</th>
                  <th className="py-3 px-3.5 text-center rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {debtors.map((d) => (
                  <tr key={d.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3.5">
                      <p className="font-extrabold text-navy-950">{d.name}</p>
                      <span className="text-[10px] text-[#1E65FF] font-mono font-bold">{d.customer_code}</span>
                    </td>
                    <td className="py-3 px-3.5 font-medium text-slate-700">
                      {formatMobile(d.mobile)}
                    </td>
                    <td className="py-3 px-3.5 text-slate-500 max-w-[150px] truncate">
                      {d.address}
                    </td>
                    <td className="py-3 px-3.5 text-right font-extrabold text-navy-950">
                      {formatCurrency(d.total_purchased)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-bold text-emerald-600">
                      {formatCurrency(d.total_paid)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-extrabold text-rose-600">
                      {formatCurrency(d.outstanding_balance)}
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openAddPaymentForCustomer(d)}
                          className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors inline-flex items-center gap-1"
                        >
                          <Receipt className="w-3 h-3" />
                          Collect
                        </button>
                        <a
                          href={`https://wa.me/91${d.mobile?.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Dear ${d.name}, Greetings from Usha Jewellers. Your pending balance is ${formatCurrency(
                              d.outstanding_balance
                            )}. Kindly clear at your earliest convenience.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                          title="Send WhatsApp Reminder"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Jewellery Categories Distribution */}
      <div className="bg-white border border-[#F1F4F9] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
        <h3 className="text-base sm:text-lg font-extrabold text-navy-950 flex items-center gap-2 tracking-tight mb-4">
          <Sparkles className="w-5 h-5 text-amber-600" />
          Category-Wise Jewellery Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categoryList.map((cat) => (
            <div key={cat.name} className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/60 text-center">
              <span className="text-xs font-bold text-navy-950 block truncate">{cat.name}</span>
              <p className="text-base font-extrabold text-[#1E65FF] mt-1">{cat.count} pcs</p>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">{formatWeight(cat.weight)}</p>
              <p className="text-[11px] font-bold text-slate-900 mt-1">{formatCurrency(cat.total)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
