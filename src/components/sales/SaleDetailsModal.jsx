import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import {
  formatCurrency,
  formatDate,
  formatMobile,
  formatWeight,
  maskAadhaar
} from '../../utils/formatters';
import { Printer, ShieldCheck, Receipt } from 'lucide-react';

export const SaleDetailsModal = () => {
  const {
    activeSaleDetails,
    setActiveSaleDetails,
    customers,
    openAddPaymentForCustomer
  } = useApp();

  if (!activeSaleDetails) return null;

  const sale = activeSaleDetails;
  const customer = customers.find((c) => c.id === sale.customer_id);

  const handlePrint = () => {
    window.print();
  };

  const hasBalance = Number(sale.balance_amount || 0) > 0;

  return (
    <Modal
      isOpen={Boolean(activeSaleDetails)}
      onClose={() => setActiveSaleDetails(null)}
      title="Tax Invoice & Estimation Slip"
      subtitle={`Invoice No: ${sale.invoice_number}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Print Bar */}
        <div className="flex items-center justify-between bg-[#F8FAFC] p-3.5 rounded-2xl border border-slate-200/70 no-print">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-bold text-navy-950">Status:</span>
            {sale.payment_status === 'paid' ? (
              <Badge variant="emerald">Payment Completed</Badge>
            ) : sale.payment_status === 'partial' ? (
              <Badge variant="brand">Installment Ongoing (Balance: {formatCurrency(sale.balance_amount)})</Badge>
            ) : (
              <Badge variant="rose">Payment Pending</Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasBalance && (
              <button
                onClick={() => {
                  const s = sale;
                  setActiveSaleDetails(null);
                  openAddPaymentForCustomer(customer, s);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold shadow-xs transition-colors"
              >
                <Receipt className="w-3.5 h-3.5" />
                Record Installment
              </button>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#1E65FF] hover:bg-[#1554E8] text-white rounded-full text-xs font-bold shadow-[0_4px_14px_rgba(30,101,255,0.35)] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Tax Bill
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 text-slate-800 print-card font-sans shadow-xs">
          {/* Shop Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-black tracking-wider text-amber-800 uppercase">
                  USHA JEWELLERS
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-sans font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> BIS 916 Hallmarked
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Exquisite Hallmarked Gold & Diamond Jewellery
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Main Market Road, Near Clock Tower, Mumbai - 400001
              </p>
              <p className="text-xs text-slate-500">
                Phone: +91 98765 43210 | GSTIN: <strong>27AAACU1234F1Z8</strong>
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                TAX INVOICE
              </span>
              <p className="text-lg font-mono font-bold text-slate-900 mt-0.5">
                {sale.invoice_number}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Date: <strong className="text-slate-800">{formatDate(sale.sale_date)}</strong>
              </p>
            </div>
          </div>

          {/* Customer & Billing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Billed To (Customer):
              </p>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {customer?.name || sale.customer_name}
              </p>
              <p className="text-slate-600 font-mono mt-0.5">
                Customer ID: {customer?.customer_code || sale.customer_code}
              </p>
              <p className="text-slate-600 mt-0.5">
                Mobile: {formatMobile(customer?.mobile || '')}
              </p>
              <p className="text-slate-600 mt-0.5">
                Address: {customer?.address || '—'}
              </p>
              {customer?.aadhaar_number && (
                <p className="text-slate-600 font-mono mt-0.5">
                  Aadhaar: {maskAadhaar(customer.aadhaar_number)}
                </p>
              )}
            </div>

            <div className="sm:text-right space-y-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Payment Status:
              </p>
              <p className={`text-base font-bold uppercase ${hasBalance ? 'text-rose-700' : 'text-emerald-700'}`}>
                {sale.payment_status}
              </p>
              {hasBalance && (
                <p className="text-xs text-rose-600 font-semibold">
                  Outstanding Balance: {formatCurrency(sale.balance_amount)}
                </p>
              )}
              {sale.notes && (
                <p className="text-xs text-slate-500 italic pt-1">
                  Note: {sale.notes}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Description of Goods</th>
                  <th className="py-2.5 px-3">Purity</th>
                  <th className="py-2.5 px-3">HUID</th>
                  <th className="py-2.5 px-3 text-right">Gross Wt</th>
                  <th className="py-2.5 px-3 text-right">Stone Wt</th>
                  <th className="py-2.5 px-3 text-right">Net Wt</th>
                  <th className="py-2.5 px-3 text-right">Gold Rate</th>
                  <th className="py-2.5 px-3 text-right">Making</th>
                  <th className="py-2.5 px-3 text-right">Item Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sale.items && sale.items.length > 0 ? (
                  sale.items.map((it, idx) => (
                    <tr key={it.id || idx}>
                      <td className="py-3 px-3 text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {it.item_name}
                        <span className="block text-[11px] text-slate-500 font-normal">
                          Category: {it.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-amber-800 font-mono">
                        {it.karat}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">
                        {it.huid_code || '—'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700">
                        {formatWeight(it.gross_weight)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        {formatWeight(it.stone_weight)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-amber-800">
                        {formatWeight(it.net_weight)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700">
                        ₹{Number(it.gold_rate_per_gram || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700">
                        {formatCurrency(it.making_charges)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(it.item_total)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="py-4 text-center text-slate-400">
                      No item rows found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals & Calculations Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t-2 border-slate-200 text-xs">
            {/* Left: Weight Totals & Terms */}
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-700">
                  <span>Total Gross Weight:</span>
                  <strong>{formatWeight(sale.total_gross_weight)}</strong>
                </div>
                <div className="flex justify-between text-amber-800">
                  <span>Total Pure Gold Net Weight:</span>
                  <strong>{formatWeight(sale.total_net_weight)}</strong>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed space-y-1">
                <p className="font-semibold text-slate-700 uppercase">Declaration & Terms:</p>
                <p>1. Certified 100% BIS Hallmarked genuine gold according to Government of India standards.</p>
                <p>2. Subject to Mumbai Jurisdiction only.</p>
              </div>
            </div>

            {/* Right: Financial Totals */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-900">{formatCurrency(sale.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Making Charges:</span>
                <span className="font-mono text-slate-900">{formatCurrency(sale.making_charges)}</span>
              </div>
              {Number(sale.discount || 0) > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount:</span>
                  <span className="font-mono">- {formatCurrency(sale.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST (3% on Gold):</span>
                <span className="font-mono text-slate-900">{formatCurrency(sale.gst_amount)}</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold">
                <span className="text-slate-900">Invoice Grand Total:</span>
                <span className="text-amber-800 font-mono text-base">
                  {formatCurrency(sale.final_amount)}
                </span>
              </div>

              <div className="flex justify-between pt-1 text-emerald-700 font-semibold">
                <span>Amount Paid:</span>
                <span className="font-mono">{formatCurrency(sale.paid_amount)}</span>
              </div>

              <div className="flex justify-between pt-1 text-rose-700 font-bold border-t border-slate-200">
                <span>Balance Due:</span>
                <span className="font-mono text-base">{formatCurrency(sale.balance_amount)}</span>
              </div>
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="grid grid-cols-2 gap-4 pt-8 text-xs text-center border-t border-slate-200">
            <div>
              <p className="h-10"></p>
              <p className="border-t border-slate-300 pt-1 text-slate-500">Customer Signature</p>
            </div>
            <div>
              <p className="h-10 text-amber-800 font-serif font-bold text-sm">For USHA JEWELLERS</p>
              <p className="border-t border-slate-300 pt-1 text-slate-500">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
