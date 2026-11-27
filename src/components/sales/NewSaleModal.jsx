import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatWeight, generateNextId } from '../../utils/formatters';
import { Plus, Trash2, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';

const CATEGORIES = ['Necklace', 'Bangle', 'Ring', 'Chain', 'Earring', 'Mangalsutra', 'Coin', 'Bar', 'Other'];
const KARATS = ['22K', '24K', '18K'];

export const NewSaleModal = () => {
  const {
    isNewSaleOpen,
    setIsNewSaleOpen,
    selectedSaleCustomer,
    setSelectedSaleCustomer,
    customers,
    sales,
    rates,
    handleAddSale
  } = useApp();

  const [customerId, setCustomerId] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState('');

  // Items
  const [items, setItems] = useState([
    {
      id: 1,
      item_name: '',
      category: 'Necklace',
      karat: '22K',
      gross_weight: '',
      stone_weight: '0',
      net_weight: '',
      gold_rate_per_gram: rates?.karat_22k || 7200,
      making_charges: '',
      wastage_percent: '0',
      huid_code: ''
    }
  ]);

  // Invoice calculations
  const [gstPercent, setGstPercent] = useState(3.0);
  const [discount, setDiscount] = useState(0);

  // Payment
  const [paymentOption, setPaymentOption] = useState('full');
  const [downPaymentAmount, setDownPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('upi');
  const [paymentRef, setPaymentRef] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isNewSaleOpen) {
      const nextInv = generateNextId('INV', sales, 'invoice_number');
      setInvoiceNumber(nextInv);
      if (selectedSaleCustomer) {
        setCustomerId(selectedSaleCustomer.id);
      } else if (customers.length > 0 && !customerId) {
        setCustomerId(customers[0].id);
      }
      setSaleDate(new Date().toISOString().split('T')[0]);
    }
  }, [isNewSaleOpen, selectedSaleCustomer, customers, sales]);

  const handleClose = () => {
    setIsNewSaleOpen(false);
    setSelectedSaleCustomer(null);
  };

  const getKaratRate = (karat) => {
    if (!rates) return 7200;
    if (karat === '24K') return rates.karat_24k || 7850;
    if (karat === '18K') return rates.karat_18k || 5900;
    return rates.karat_22k || 7200;
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        item_name: '',
        category: 'Ring',
        karat: '22K',
        gross_weight: '',
        stone_weight: '0',
        net_weight: '',
        gold_rate_per_gram: getKaratRate('22K'),
        making_charges: '',
        wastage_percent: '0',
        huid_code: ''
      }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };

    if (field === 'karat') {
      current.gold_rate_per_gram = getKaratRate(value);
    }

    if (field === 'gross_weight' || field === 'stone_weight') {
      const gross = parseFloat(field === 'gross_weight' ? value : current.gross_weight) || 0;
      const stone = parseFloat(field === 'stone_weight' ? value : current.stone_weight) || 0;
      current.net_weight = Math.max(0, gross - stone).toFixed(3);
    }

    updated[index] = current;
    setItems(updated);
  };

  const calculatedItems = items.map((item) => {
    const netWt = parseFloat(item.net_weight || item.gross_weight) || 0;
    const rate = parseFloat(item.gold_rate_per_gram) || 0;
    const making = parseFloat(item.making_charges) || 0;
    const wastage = parseFloat(item.wastage_percent) || 0;

    const goldValue = netWt * rate;
    const wastageValue = goldValue * (wastage / 100);
    const itemTotal = goldValue + wastageValue + making;

    return {
      ...item,
      gold_value: goldValue,
      wastage_amount: wastageValue,
      item_total: Math.round(itemTotal)
    };
  });

  const totalGrossWeight = items.reduce((acc, i) => acc + (parseFloat(i.gross_weight) || 0), 0);
  const totalNetWeight = calculatedItems.reduce((acc, i) => acc + (parseFloat(i.net_weight) || 0), 0);
  const subtotal = calculatedItems.reduce((acc, i) => acc + i.item_total, 0);
  const totalMaking = items.reduce((acc, i) => acc + (parseFloat(i.making_charges) || 0), 0);
  const totalWastage = calculatedItems.reduce((acc, i) => acc + i.wastage_amount, 0);

  const discountAmount = parseFloat(discount) || 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gstAmount = Math.round(taxableAmount * (parseFloat(gstPercent) / 100));
  const finalAmount = Math.round(taxableAmount + gstAmount);

  useEffect(() => {
    if (paymentOption === 'full') {
      setDownPaymentAmount(finalAmount);
    } else if (paymentOption === 'pending') {
      setDownPaymentAmount(0);
    }
  }, [paymentOption, finalAmount]);

  const paidAmount = parseFloat(downPaymentAmount) || 0;
  const balanceAmount = Math.max(0, finalAmount - paidAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      alert('Please select a customer');
      return;
    }

    const selectedCust = customers.find((c) => c.id === customerId);
    if (!selectedCust) return;

    if (items.some((i) => !i.item_name.trim() || !(parseFloat(i.gross_weight) > 0))) {
      alert('Please fill in Item Name and valid Gross Weight for all items.');
      return;
    }

    let status = 'pending';
    if (balanceAmount <= 0) status = 'paid';
    else if (paidAmount > 0) status = 'partial';

    const salePayload = {
      invoice_number: invoiceNumber,
      customer_id: selectedCust.id,
      customer_name: selectedCust.name,
      customer_code: selectedCust.customer_code,
      sale_date: saleDate,
      items: calculatedItems,
      total_gross_weight: parseFloat(totalGrossWeight.toFixed(3)),
      total_net_weight: parseFloat(totalNetWeight.toFixed(3)),
      subtotal,
      making_charges: totalMaking,
      wastage_amount: totalWastage,
      gst_percent: parseFloat(gstPercent),
      gst_amount: gstAmount,
      discount: discountAmount,
      final_amount: finalAmount,
      paid_amount: paidAmount,
      balance_amount: balanceAmount,
      payment_status: status,
      initial_payment_mode: paymentMode,
      initial_payment_ref: paymentRef,
      notes: notes.trim()
    };

    await handleAddSale(salePayload);
  };

  return (
    <Modal
      isOpen={isNewSaleOpen}
      onClose={handleClose}
      title="Create Gold Sale & Tax Invoice"
      subtitle="Hallmarked jewellery bill with automatic karat pricing and installment tracking"
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Invoice Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Customer *
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
              required
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.customer_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Invoice Number
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-amber-800 font-mono font-bold focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Invoice Date
            </label>
            <input
              type="date"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
              required
            />
          </div>
        </div>

        {/* Current Gold Rates Quick Banner */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
          <div className="flex items-center gap-2 text-amber-800 font-bold">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Today's Board Rates:</span>
          </div>
          <div className="flex items-center gap-4 text-slate-700 font-mono font-semibold">
            <span>24K: <strong className="text-amber-800">₹{rates?.karat_24k || 7850}/g</strong></span>
            <span>22K: <strong className="text-slate-900">₹{rates?.karat_22k || 7200}/g</strong></span>
            <span>18K: <strong className="text-slate-800">₹{rates?.karat_18k || 5900}/g</strong></span>
          </div>
        </div>

        {/* Items Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-700" />
              Jewellery Items ({items.length})
            </h4>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-amber-800 rounded-lg text-xs font-bold border border-slate-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3"
              >
                {/* Row 1: Name, Category, Karat */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={item.item_name}
                      onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                      placeholder="e.g. 22K Kolkata Filigree Bangle"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                      Category
                    </label>
                    <select
                      value={item.category}
                      onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                      Karat Purity
                    </label>
                    <select
                      value={item.karat}
                      onChange={(e) => handleItemChange(index, 'karat', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-amber-800 font-bold focus:outline-none focus:border-amber-500"
                    >
                      {KARATS.map((k) => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Weights, Rates, Making, Wastage, Total */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-semibold">Gross Wt (g)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={item.gross_weight}
                      onChange={(e) => handleItemChange(index, 'gross_weight', e.target.value)}
                      placeholder="0.000"
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 font-mono font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-semibold">Stone Wt (g)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={item.stone_weight}
                      onChange={(e) => handleItemChange(index, 'stone_weight', e.target.value)}
                      placeholder="0.000"
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-semibold">Net Wt (g)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={item.net_weight}
                      readOnly
                      placeholder="0.000"
                      className="w-full bg-slate-100 border border-slate-200 rounded px-2 py-1 text-amber-800 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-semibold">Rate/g (₹)</label>
                    <input
                      type="number"
                      value={item.gold_rate_per_gram}
                      onChange={(e) => handleItemChange(index, 'gold_rate_per_gram', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-semibold">Making (₹)</label>
                    <input
                      type="number"
                      value={item.making_charges}
                      onChange={(e) => handleItemChange(index, 'making_charges', e.target.value)}
                      placeholder="e.g. 4500"
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase font-semibold">Item Total</label>
                      <span className="font-bold text-amber-800 font-mono text-sm">
                        {formatCurrency(calculatedItems[index]?.item_total || 0)}
                      </span>
                    </div>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-slate-400 hover:text-rose-600 p-1 mt-2"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Optional HUID Code */}
                <div className="pt-1 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <input
                    type="text"
                    value={item.huid_code}
                    onChange={(e) => handleItemChange(index, 'huid_code', e.target.value)}
                    placeholder="HUID (Hallmarking Unique ID, e.g. HUID-88A901)"
                    className="bg-transparent text-[11px] text-slate-600 placeholder-slate-400 focus:outline-none focus:text-slate-900 font-mono flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Summary & Tax Calculations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Total Gross Weight:</span>
              <strong className="font-mono text-slate-900">{formatWeight(totalGrossWeight)}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Net Gold Weight:</span>
              <strong className="font-mono text-amber-800">{formatWeight(totalNetWeight)}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Making Charges:</span>
              <span className="font-mono text-slate-900">{formatCurrency(totalMaking)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
          </div>

          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 md:pl-4 pt-2 md:pt-0">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Discount (₹):</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-24 bg-white border border-slate-300 rounded px-2 py-0.5 text-right font-mono text-slate-900 text-xs"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">GST ({gstPercent}%):</span>
              <span className="font-mono text-slate-900">{formatCurrency(gstAmount)}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm">
              <strong className="text-slate-900 text-base">Grand Total:</strong>
              <strong className="text-amber-800 text-lg font-bold font-mono">
                {formatCurrency(finalAmount)}
              </strong>
            </div>
          </div>
        </div>

        {/* Payment & Installment Scheme Options */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Payment Terms & Installment Option
            </h4>
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setPaymentOption('full')}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  paymentOption === 'full' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Full Payment
              </button>
              <button
                type="button"
                onClick={() => setPaymentOption('partial')}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  paymentOption === 'partial' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Installment / Partial
              </button>
              <button
                type="button"
                onClick={() => setPaymentOption('pending')}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  paymentOption === 'pending' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Full Credit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Advance Paid Now (₹)
              </label>
              <input
                type="number"
                value={downPaymentAmount}
                onChange={(e) => {
                  setDownPaymentAmount(e.target.value);
                  setPaymentOption('partial');
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-emerald-700 font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                disabled={paidAmount <= 0}
              >
                <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                <option value="cash">Cash at Counter</option>
                <option value="card">Credit / Debit Card</option>
                <option value="bank_transfer">Bank Transfer (NEFT / RTGS)</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Remaining Balance (₹)
              </label>
              <div className="px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm font-bold font-mono text-rose-700">
                {formatCurrency(balanceAmount)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
              Transaction Notes / Installment Schedule
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Balance of ₹75,000 to be paid on 15th March via UPI"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
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
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#1E65FF] hover:bg-[#1554E8] rounded-full shadow-[0_4px_14px_rgba(30,101,255,0.35)] transition-all active:scale-[0.98]"
          >
            Generate Invoice & Save Sale
          </button>
        </div>
      </form>
    </Modal>
  );
};
