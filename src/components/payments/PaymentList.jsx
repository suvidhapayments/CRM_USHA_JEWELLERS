import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Receipt,
  PlusCircle,
  Search,
  Download
} from 'lucide-react';

export const PaymentList = () => {
  const {
    payments,
    setIsAddPaymentOpen,
    setActiveReceipt
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState('all');

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (modeFilter !== 'all' && p.payment_mode !== modeFilter) return false;

      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      const rcpMatch = p.receipt_number?.toLowerCase().includes(q);
      const custMatch = p.customer_name?.toLowerCase().includes(q);
      const invMatch = p.invoice_number?.toLowerCase().includes(q);
      const refMatch = p.transaction_ref?.toLowerCase().includes(q);

      return rcpMatch || custMatch || invMatch || refMatch;
    });
  }, [payments, searchTerm, modeFilter]);

  const totalCollections = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const upiTotal = payments.filter(p => p.payment_mode === 'upi').reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const cashTotal = payments.filter(p => p.payment_mode === 'cash').reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const bankCardTotal = totalCollections - (upiTotal + cashTotal);

  const handleExportCSV = () => {
    const headers = ['Receipt No', 'Customer', 'Invoice No', 'Amount', 'Date', 'Payment Mode', 'Reference', 'Notes'];
    const rows = filteredPayments.map((p) => [
      p.receipt_number,
      `"${p.customer_name}"`,
      p.invoice_number || '',
      p.amount,
      p.payment_date,
      p.payment_mode,
      `"${p.transaction_ref || ''}"`,
      `"${p.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `usha_jewellers_payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Collections KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-500">Total Collections</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{formatCurrency(totalCollections)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{payments.length} payment transactions</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-500">UPI / QR Collections</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(upiTotal)}</p>
          <p className="text-xs text-slate-500 mt-0.5">PhonePe, GPay, Paytm</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-500">Cash at Counter</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">{formatCurrency(cashTotal)}</p>
          <p className="text-xs text-slate-500 mt-0.5">Physical cash drawer</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-500">Cards & Bank Transfer</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(bankCardTotal)}</p>
          <p className="text-xs text-slate-500 mt-0.5">NEFT, RTGS, POS Swipe</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Receipt No (RCP-2026-001), Customer, or Reference..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {['all', 'upi', 'cash', 'card', 'bank_transfer', 'cheque'].map((mode) => (
            <button
              key={mode}
              onClick={() => setModeFilter(mode)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase whitespace-nowrap transition-colors ${
                modeFilter === mode
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mode === 'all' ? 'All Modes' : mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Export Payments CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAddPaymentOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl text-sm shadow-xs transition-all duration-150"
          >
            <PlusCircle className="w-4 h-4" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Receipt No</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Linked Invoice</th>
                <th className="py-3 px-4 text-right">Amount Received</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Reference / Details</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2 opacity-50" />
                    No payments found matching your search.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      {p.receipt_number}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {formatDate(p.payment_date)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {p.customer_name}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-800">
                      {p.invoice_number || '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-3 px-4 uppercase text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-semibold">
                        {p.payment_mode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">
                      {p.transaction_ref || p.notes || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveReceipt(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Receipt <Receipt className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
