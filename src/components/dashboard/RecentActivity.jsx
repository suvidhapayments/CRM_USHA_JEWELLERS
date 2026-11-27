import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDate, formatWeight } from '../../utils/formatters';
import {
  FileText,
  Receipt,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

export const RecentActivity = () => {
  const {
    metrics,
    setActiveTab,
    setActiveSaleDetails,
    setActiveReceipt
  } = useApp();

  if (!metrics) return null;

  const { recentSales, recentPayments } = metrics;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Recent Sales Transactions */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                Recent Sales Transactions
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest gold jewellery bills generated
              </p>
            </div>
            <button
              onClick={() => setActiveTab('sales')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Invoice</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3 text-right">Gold Wt</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Bill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-800">
                      {sale.invoice_number}
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="font-semibold text-slate-900 truncate max-w-[120px]">
                        {sale.customer_name}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatDate(sale.sale_date)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {formatWeight(sale.total_net_weight || sale.total_gross_weight)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {formatCurrency(sale.final_amount)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {sale.payment_status === 'paid' ? (
                        <Badge variant="emerald" size="sm">Paid</Badge>
                      ) : sale.payment_status === 'partial' ? (
                        <Badge variant="gold" size="sm">Partial</Badge>
                      ) : (
                        <Badge variant="rose" size="sm">Pending</Badge>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setActiveSaleDetails(sale)}
                        className="text-slate-400 hover:text-slate-800 p-1 rounded hover:bg-slate-100 transition-colors"
                        title="View Tax Invoice"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. Recent Payment Entries */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                Recent Payment Entries
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Installments and counter payment receipts
              </p>
            </div>
            <button
              onClick={() => setActiveTab('payments')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Receipt No</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                      {p.receipt_number}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 truncate max-w-[130px]">
                      {p.customer_name}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-2.5 px-3 uppercase text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-semibold">
                        {p.payment_mode}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {formatDate(p.payment_date)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setActiveReceipt(p)}
                        className="text-slate-400 hover:text-emerald-700 p-1 rounded hover:bg-slate-100 transition-colors"
                        title="View Payment Receipt"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
