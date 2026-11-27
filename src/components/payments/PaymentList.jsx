import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { EmptyStateIllustration } from '../illustrations/EmptyStateIllustration';
import {
  Receipt,
  PlusCircle,
  Search,
  Download,
  CreditCard,
  Banknote,
  QrCode
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
        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
          <p className="text-xs uppercase font-bold text-slate-400">Total Collections</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{formatCurrency(totalCollections)}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{payments.length} payment transactions</p>
        </div>

        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
          <p className="text-xs uppercase font-bold text-slate-400">UPI / QR Collections</p>
          <p className="text-2xl font-extrabold text-navy-950 mt-1">{formatCurrency(upiTotal)}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">PhonePe, GPay, Paytm</p>
        </div>

        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
          <p className="text-xs uppercase font-bold text-slate-400">Cash at Counter</p>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{formatCurrency(cashTotal)}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Physical cash drawer</p>
        </div>

        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
          <p className="text-xs uppercase font-bold text-slate-400">Cards & Bank Transfer</p>
          <p className="text-2xl font-extrabold text-[#1E65FF] mt-1">{formatCurrency(bankCardTotal)}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">NEFT, RTGS, POS Swipe</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#F1F4F9] shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Receipt (e.g. RCP-2026-001), Customer, UTR reference..."
            className="w-full bg-[#F4F6FB] border border-slate-200/70 rounded-full pl-10 pr-4 py-2.5 text-xs text-navy-950 placeholder-slate-400 focus:outline-none focus:border-[#1E65FF] focus:bg-white font-medium"
          />
        </div>

        {/* Mode Filter */}
        <div className="flex items-center gap-1.5 bg-[#F4F6FB] p-1 rounded-full border border-slate-200/70 text-xs overflow-x-auto">
          <button
            onClick={() => setModeFilter('all')}
            className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              modeFilter === 'all' ? 'bg-[#1E65FF] text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            All Modes
          </button>
          <button
            onClick={() => setModeFilter('upi')}
            className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              modeFilter === 'upi' ? 'bg-[#1E65FF] text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            UPI
          </button>
          <button
            onClick={() => setModeFilter('cash')}
            className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              modeFilter === 'cash' ? 'bg-[#1E65FF] text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            Cash
          </button>
          <button
            onClick={() => setModeFilter('card')}
            className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              modeFilter === 'card' ? 'bg-[#1E65FF] text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            Card
          </button>
          <button
            onClick={() => setModeFilter('bank_transfer')}
            className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              modeFilter === 'bank_transfer' ? 'bg-[#1E65FF] text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            RTGS/NEFT
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:text-navy-950 hover:bg-slate-200 border border-slate-200/70 transition-colors"
            title="Export Payments CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAddPaymentOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E65FF] hover:bg-[#1554E8] text-white font-bold rounded-full text-xs shadow-[0_4px_14px_rgba(30,101,255,0.35)] transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Payment Receipts Table */}
      <div className="bg-white border border-[#F1F4F9] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
        {filteredPayments.length === 0 ? (
          <div className="p-10 sm:p-12 text-center">
            <EmptyStateIllustration type="payments" className="w-36 h-36 mx-auto mb-2" />
            <h3 className="text-lg font-extrabold text-navy-950">No payments found</h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Record a customer installment or counter collection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAFC] text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Invoice Linked</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Payment Mode</th>
                  <th className="py-3 px-4">Reference / UTR</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-navy-950">
                      {p.receipt_number}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-extrabold text-navy-950">{p.customer_name}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#1E65FF] font-bold">
                      {p.invoice_number || <span className="text-slate-400 font-normal">Account Deposit</span>}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {formatDate(p.payment_date)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F4F6FB] text-navy-950 border border-slate-200/70">
                        {p.payment_mode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 truncate max-w-[150px]">
                      {p.transaction_ref || '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-600">
                      +{formatCurrency(p.amount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveReceipt(p)}
                        className="px-3 py-1 rounded-full text-xs font-bold bg-[#F4F6FB] hover:bg-brand-50 text-navy-950 hover:text-[#1E65FF] transition-colors"
                      >
                        Print Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
