import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { formatCurrency, generateNextId, formatDate } from '../../utils/formatters';
import { User } from 'lucide-react';

export const AddPaymentModal = () => {
  const {
    isAddPaymentOpen,
    setIsAddPaymentOpen,
    paymentPreselect,
    setPaymentPreselect,
    customers,
    sales,
    payments,
    handleAddPayment
  } = useApp();

  const [customerId, setCustomerId] = useState('');
  const [saleId, setSaleId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('upi');
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [notes, setNotes] = useState('');

  const selectedCustomer = customers.find((c) => c.id === customerId);
  const customerUnpaidSales = sales.filter(
    (s) => s.customer_id === customerId && (s.payment_status !== 'paid' || Number(s.balance_amount) > 0)
  );

  useEffect(() => {
    if (isAddPaymentOpen) {
      const nextRcp = generateNextId('RCP', payments, 'receipt_number');
      setReceiptNumber(nextRcp);
      setPaymentDate(new Date().toISOString().split('T')[0]);

      if (paymentPreselect.customer) {
        setCustomerId(paymentPreselect.customer.id);
        if (paymentPreselect.sale) {
          setSaleId(paymentPreselect.sale.id);
          setAmount(paymentPreselect.sale.balance_amount || '');
        } else {
          setAmount(paymentPreselect.customer.outstanding_balance || '');
        }
      } else if (customers.length > 0 && !customerId) {
        setCustomerId(customers[0].id);
      }
    }
  }, [isAddPaymentOpen, paymentPreselect, customers, payments]);

  const handleClose = () => {
    setIsAddPaymentOpen(false);
    setPaymentPreselect({ customer: null, sale: null });
  };

  const handleCustomerChange = (id) => {
    setCustomerId(id);
    const cust = customers.find((c) => c.id === id);
    if (cust && Number(cust.outstanding_balance) > 0) {
      setAmount(cust.outstanding_balance);
    } else {
      setAmount('');
    }
    setSaleId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      alert('Please select a customer');
      return;
    }

    const payAmount = parseFloat(amount);
    if (!payAmount || payAmount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    const cust = customers.find((c) => c.id === customerId);
    const sale = sales.find((s) => s.id === saleId);

    const payload = {
      receipt_number: receiptNumber,
      customer_id: cust.id,
      customer_name: cust.name,
      sale_id: sale?.id || null,
      invoice_number: sale?.invoice_number || null,
      amount: payAmount,
      payment_date: paymentDate,
      payment_mode: paymentMode,
      transaction_ref: transactionRef.trim(),
      notes: notes.trim()
    };

    await handleAddPayment(payload);
  };

  return (
    <Modal
      isOpen={isAddPaymentOpen}
      onClose={handleClose}
      title="Record Payment / Installment"
      subtitle="Issue customer receipt and adjust gold purchase balance"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Customer *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <select
              value={customerId}
              onChange={(e) => handleCustomerChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              required
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.customer_code}) - Balance: {formatCurrency(c.outstanding_balance)}
                </option>
              ))}
            </select>
          </div>
          {selectedCustomer && (
            <div className="flex items-center justify-between text-xs mt-2 px-1">
              <span className="text-slate-500">Current Outstanding Balance:</span>
              <strong className={`font-mono text-sm ${Number(selectedCustomer.outstanding_balance) > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {formatCurrency(selectedCustomer.outstanding_balance)}
              </strong>
            </div>
          )}
        </div>

        {/* Link to specific invoice (Optional) */}
        {customerUnpaidSales.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Link to Unpaid Bill (Optional)
            </label>
            <select
              value={saleId}
              onChange={(e) => {
                setSaleId(e.target.value);
                const s = sales.find((sale) => sale.id === e.target.value);
                if (s) setAmount(s.balance_amount);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
            >
              <option value="">General Account Credit / Any Invoice</option>
              {customerUnpaidSales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.invoice_number} ({formatDate(s.sale_date)}) - Balance: {formatCurrency(s.balance_amount)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Receipt Number & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Receipt Number
            </label>
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-emerald-700 font-mono font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Payment Date
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              required
            />
          </div>
        </div>

        {/* Amount Received */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Amount Received (₹) *
            </label>
            {selectedCustomer && Number(selectedCustomer.outstanding_balance) > 0 && (
              <button
                type="button"
                onClick={() => setAmount(selectedCustomer.outstanding_balance)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold underline"
              >
                Clear Full Balance ({formatCurrency(selectedCustomer.outstanding_balance)})
              </button>
            )}
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3.5 py-2.5 text-lg font-mono font-bold text-emerald-700 focus:outline-none focus:border-emerald-500 focus:bg-white"
              required
            />
          </div>
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Payment Mode *
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[
              { id: 'upi', label: 'UPI' },
              { id: 'cash', label: 'Cash' },
              { id: 'card', label: 'Card' },
              { id: 'bank_transfer', label: 'Bank/NEFT' },
              { id: 'cheque', label: 'Cheque' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMode(m.id)}
                className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition-all ${
                  paymentMode === m.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Reference & Remarks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Reference / UTR / Cheque No
            </label>
            <input
              type="text"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="e.g. UPI-98201 / CHQ-10492"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Notes / Installment Month
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Month 3 installment for bridal set"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-navy-950 rounded-full hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-all active:scale-[0.98]"
          >
            Record Payment & Issue Receipt
          </button>
        </div>
      </form>
    </Modal>
  );
};
