import React from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate, formatMobile } from '../../utils/formatters';
import { Printer } from 'lucide-react';

export const PaymentReceiptModal = () => {
  const { activeReceipt, setActiveReceipt, customers } = useApp();

  if (!activeReceipt) return null;

  const payment = activeReceipt;
  const customer = customers.find((c) => c.id === payment.customer_id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={Boolean(activeReceipt)}
      onClose={() => setActiveReceipt(null)}
      title="Payment Receipt"
      subtitle={`Receipt No: ${payment.receipt_number}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <div className="flex justify-end no-print">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Receipt Slip
          </button>
        </div>

        {/* Printable Receipt Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 text-slate-800 print-card font-sans shadow-xs">
          {/* Header */}
          <div className="text-center pb-4 border-b border-slate-200">
            <h2 className="text-xl font-serif font-black tracking-wider text-amber-800 uppercase">
              USHA JEWELLERS
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Main Market Road, Near Clock Tower, Mumbai - 400001
            </p>
            <p className="text-xs text-slate-500">
              Phone: +91 98765 43210 | GSTIN: 27AAACU1234F1Z8
            </p>
            <div className="mt-2 inline-block px-3 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-[11px] font-bold uppercase tracking-wider">
              Official Payment Receipt
            </div>
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-500">Receipt No:</p>
              <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                {payment.receipt_number}
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">Date:</p>
              <p className="font-semibold text-slate-900 mt-0.5">
                {formatDate(payment.payment_date)}
              </p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
            <p className="text-slate-500">Received with thanks from:</p>
            <p className="text-base font-bold text-slate-900">
              {customer?.name || payment.customer_name}
            </p>
            <p className="text-slate-600">
              Customer Code: <strong className="text-amber-800 font-mono">{customer?.customer_code}</strong> | Phone: {formatMobile(customer?.mobile || '')}
            </p>
            {payment.invoice_number && (
              <p className="text-slate-600">
                Against Invoice: <strong className="text-slate-900 font-mono">{payment.invoice_number}</strong>
              </p>
            )}
          </div>

          {/* Amount Paid Highlight */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Amount Received
            </p>
            <p className="text-3xl font-black font-mono text-emerald-800">
              {formatCurrency(payment.amount)}
            </p>
            <p className="text-xs text-slate-600 mt-1 uppercase font-semibold">
              Mode: <strong>{payment.payment_mode}</strong> {payment.transaction_ref ? `(${payment.transaction_ref})` : ''}
            </p>
          </div>

          {/* Customer Remaining Balance */}
          {customer && (
            <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono">
              <span className="text-slate-500">Remaining Balance:</span>
              <strong className={`text-sm ${Number(customer.outstanding_balance) > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {formatCurrency(customer.outstanding_balance)}
              </strong>
            </div>
          )}

          {payment.notes && (
            <p className="text-xs text-slate-500 italic">
              Remarks: {payment.notes}
            </p>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-4 pt-6 text-xs text-center border-t border-slate-200">
            <div>
              <p className="h-8"></p>
              <p className="border-t border-slate-300 pt-1 text-slate-500">Depositor Signature</p>
            </div>
            <div>
              <p className="h-8 text-amber-800 font-serif font-bold text-xs">USHA JEWELLERS</p>
              <p className="border-t border-slate-300 pt-1 text-slate-500">Cashier / Authorized</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
