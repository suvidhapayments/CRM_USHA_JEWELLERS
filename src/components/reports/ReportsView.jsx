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
  Sparkles
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileBarChart2 className="w-5 h-5 text-amber-600" />
            Sales, Bullion & Outstanding Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit summary, category volume, and debtor aging for Usha Jewellers
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setDateRange('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              dateRange === 'all' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              dateRange === 'month' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setDateRange('today')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              dateRange === 'today' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today Only
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-500">Total Billed</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalSalesVal)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{filteredSales.length} Invoices</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-500">Pure Gold Sold</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">{formatWeight(totalGoldWeight)}</p>
          <p className="text-xs text-amber-700 mt-0.5">22K / 24K Volume</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-500">Total Realized</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{formatCurrency(totalPaidVal)}</p>
          <p className="text-xs text-emerald-600 mt-0.5">Counter & Bank Cash</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-500">Uncollected Balance</p>
          <p className="text-2xl font-bold text-rose-700 mt-1">{formatCurrency(totalOutstanding)}</p>
          <p className="text-xs text-rose-600 mt-0.5">Installment Credit</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-500">Avg Invoice Size</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(avgBillSize)}</p>
          <p className="text-xs text-slate-500 mt-0.5">Per Transaction</p>
        </div>
      </div>

      {/* Outstanding Balances & Aging Follow-up List */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Customer Installment Follow-Up & Outstanding Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct WhatsApp reminder triggers with pre-filled balance and payment link
            </p>
          </div>

          <button
            onClick={handleExportAging}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Debtors CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4 text-right">Lifetime Bought</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-right">Pending Balance</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {debtors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-emerald-700 font-semibold">
                    <CheckCircle className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                    All customer accounts are 100% settled! No pending balances.
                  </td>
                </tr>
              ) : (
                debtors.map((c) => {
                  const cleanPhone = c.mobile.replace(/\D/g, '');
                  const message = encodeURIComponent(
                    `Namaste ${c.name} Ji, warm greetings from Usha Jewellers. Your current outstanding balance for your jewellery purchase is ${formatCurrency(c.outstanding_balance)}. Kindly clear the installment at your earliest convenience or via UPI. Thank you!`
                  );

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {c.name}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-800">
                        {c.customer_code}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">
                        {formatMobile(c.mobile)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        {formatCurrency(c.total_purchased)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700 font-semibold">
                        {formatCurrency(c.total_paid)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-base font-bold text-rose-700">
                        {formatCurrency(c.outstanding_balance)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="rose" size="sm">Payment Due</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://wa.me/91${cleanPhone}?text=${message}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                            title="Send WhatsApp Reminder"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp
                          </a>
                          <button
                            onClick={() => openAddPaymentForCustomer(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-amber-800 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            Pay
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Sales Breakdown */}
      {categoryList.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Jewellery Category Performance Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryList.map((cat) => (
              <div key={cat.name} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">{cat.name}</span>
                  <span className="text-[11px] text-slate-500">{cat.count} items sold</span>
                </div>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {formatCurrency(cat.total)}
                </p>
                <p className="text-xs text-amber-700 font-mono font-semibold">
                  {formatWeight(cat.weight)} pure weight
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
