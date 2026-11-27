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
      <div className="bg-white border border-[#F1F4F9] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(7,1,39,0.04)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-navy-950 flex items-center gap-2 tracking-tight">
                <FileText className="w-5 h-5 text-[#1E65FF]" />
                Recent Sales Transactions
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Latest gold jewellery bills generated
              </p>
            </div>
            <button
              onClick={() => setActiveTab('sales')}
              className="text-xs font-bold text-[#1E65FF] hover:underline inline-flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAFC] text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-3.5 rounded-l-xl">Invoice</th>
                  <th className="py-3 px-3.5">Customer</th>
                  <th className="py-3 px-3.5 text-right">Gold Wt</th>
                  <th className="py-3 px-3.5 text-right">Amount</th>
                  <th className="py-3 px-3.5 text-center">Status</th>
                  <th className="py-3 px-3.5 text-right rounded-r-xl">Bill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-[#1E65FF]">
                      {sale.invoice_number}
                    </td>
                    <td className="py-3 px-3.5">
                      <p className="font-bold text-navy-950 truncate max-w-[130px]">
                        {sale.customer_name}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatDate(sale.sale_date)}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono text-slate-700 font-semibold">
                      {formatWeight(sale.total_net_weight || sale.total_gross_weight)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-extrabold text-navy-950">
                      {formatCurrency(sale.final_amount)}
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      {sale.payment_status === 'paid' ? (
                        <Badge variant="emerald" size="sm">Paid</Badge>
                      ) : sale.payment_status === 'partial' ? (
                        <Badge variant="blue" size="sm">Partial</Badge>
                      ) : (
                        <Badge variant="rose" size="sm">Pending</Badge>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        onClick={() => setActiveSaleDetails(sale)}
                        className="text-slate-400 hover:text-[#1E65FF] p-1.5 rounded-full hover:bg-brand-50 transition-colors"
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

      {/* 2. Recent Payments & Collections */}
      <div className="bg-white border border-[#F1F4F9] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(7,1,39,0.04)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-navy-950 flex items-center gap-2 tracking-tight">
                <Receipt className="w-5 h-5 text-emerald-600" />
                Recent Payment Entries
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Latest customer installment collections
              </p>
            </div>
            <button
              onClick={() => setActiveTab('payments')}
              className="text-xs font-bold text-[#1E65FF] hover:underline inline-flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAFC] text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-3.5 rounded-l-xl">Receipt</th>
                  <th className="py-3 px-3.5">Customer</th>
                  <th className="py-3 px-3.5 text-center">Mode</th>
                  <th className="py-3 px-3.5 text-right">Amount</th>
                  <th className="py-3 px-3.5 text-right rounded-r-xl">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-navy-950">
                      {payment.receipt_number}
                    </td>
                    <td className="py-3 px-3.5">
                      <p className="font-bold text-navy-950 truncate max-w-[130px]">
                        {payment.customer_name}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatDate(payment.payment_date)}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {payment.payment_mode}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right font-extrabold text-emerald-700">
                      +{formatCurrency(payment.amount)}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        onClick={() => setActiveReceipt(payment)}
                        className="text-slate-400 hover:text-[#1E65FF] p-1.5 rounded-full hover:bg-brand-50 transition-colors"
                        title="Print Receipt"
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
