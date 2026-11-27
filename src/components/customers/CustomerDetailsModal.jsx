import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import {
  formatCurrency,
  formatDate,
  formatMobile,
  maskAadhaar,
  formatWeight
} from '../../utils/formatters';
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  FileText,
  PlusCircle,
  Receipt,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

export const CustomerDetailsModal = () => {
  const {
    selectedCustomer,
    setSelectedCustomer,
    sales,
    payments,
    setEditingCustomer,
    handleDeleteCustomer,
    openNewSaleForCustomer,
    openAddPaymentForCustomer,
    setActiveSaleDetails,
    setActiveReceipt
  } = useApp();

  const [showFullAadhaar, setShowFullAadhaar] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'payments'

  if (!selectedCustomer) return null;

  const customerSales = sales.filter((s) => s.customer_id === selectedCustomer.id);
  const customerPayments = payments.filter((p) => p.customer_id === selectedCustomer.id);

  const hasOutstanding = Number(selectedCustomer.outstanding_balance || 0) > 0;

  const totalGoldGrams = customerSales.reduce(
    (acc, s) => acc + Number(s.total_net_weight || s.total_gross_weight || 0),
    0
  );

  return (
    <Modal
      isOpen={Boolean(selectedCustomer)}
      onClose={() => setSelectedCustomer(null)}
      title="Customer Profile & Ledger"
      subtitle={`Customer ID: ${selectedCustomer.customer_code}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#F8FAFC] border border-[#F1F4F9]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-brand-50 border border-brand-100 flex-shrink-0 flex items-center justify-center shadow-xs">
              {selectedCustomer.photo_url ? (
                <img
                  src={selectedCustomer.photo_url}
                  alt={selectedCustomer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-[#1E65FF]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-extrabold text-navy-950 tracking-tight">
                  {selectedCustomer.name}
                </h3>
                <Badge variant="brand">{selectedCustomer.customer_code}</Badge>
                {hasOutstanding ? (
                  <Badge variant="rose">Balance Due</Badge>
                ) : (
                  <Badge variant="emerald">Zero Balance</Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#1E65FF]" />
                Customer since {formatDate(selectedCustomer.created_at)}
              </p>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                const cust = selectedCustomer;
                setSelectedCustomer(null);
                openNewSaleForCustomer(cust);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E65FF] hover:bg-[#1554E8] text-white font-bold rounded-full text-xs shadow-[0_4px_14px_rgba(30,101,255,0.35)] transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              New Sale
            </button>
            <button
              onClick={() => {
                const cust = selectedCustomer;
                setSelectedCustomer(null);
                openAddPaymentForCustomer(cust);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full text-xs shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-all active:scale-[0.98]"
            >
              <Receipt className="w-4 h-4 text-white" />
              Record Payment
            </button>
            <button
              onClick={() => {
                setEditingCustomer(selectedCustomer);
                setSelectedCustomer(null);
              }}
              className="p-2 text-slate-600 hover:text-navy-950 rounded-full bg-white hover:bg-slate-100 border border-slate-200/70 transition-colors"
              title="Edit Profile"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${selectedCustomer.name}?`)) {
                  handleDeleteCustomer(selectedCustomer.id);
                }
              }}
              className="p-2 text-rose-600 hover:text-rose-800 rounded-full bg-white hover:bg-rose-50 border border-slate-200/70 transition-colors"
              title="Delete Customer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Financial KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Purchases
            </p>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {formatCurrency(selectedCustomer.total_purchased)}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              {formatWeight(totalGoldGrams)} gold bought
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Paid
            </p>
            <p className="text-lg font-bold text-emerald-700 mt-1">
              {formatCurrency(selectedCustomer.total_paid)}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {customerPayments.length} receipts
            </p>
          </div>

          <div className={`p-4 rounded-xl border shadow-2xs ${hasOutstanding ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Outstanding Balance
            </p>
            <p className={`text-lg font-bold mt-1 ${hasOutstanding ? 'text-rose-700' : 'text-emerald-700'}`}>
              {formatCurrency(selectedCustomer.outstanding_balance)}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {hasOutstanding ? 'Installment pending' : 'Fully settled'}
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Invoices Count
            </p>
            <p className="text-lg font-bold text-blue-700 mt-1">
              {customerSales.length}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Sales transactions
            </p>
          </div>
        </div>

        {/* Customer Info & KYC Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                Primary Mobile Number
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-semibold text-slate-900">
                  {formatMobile(selectedCustomer.mobile)}
                </span>
                <a
                  href={`https://wa.me/91${selectedCustomer.mobile.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-semibold transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href={`tel:${selectedCustomer.mobile}`}
                  className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 font-semibold transition-colors"
                >
                  Call
                </a>
              </div>
            </div>

            {selectedCustomer.alternate_mobile && (
              <div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Alternate Mobile
                </p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                  {formatMobile(selectedCustomer.alternate_mobile)}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                Aadhaar Number (KYC)
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-sm text-slate-800 font-semibold tracking-wider">
                  {showFullAadhaar
                    ? selectedCustomer.aadhaar_number || 'Not provided'
                    : maskAadhaar(selectedCustomer.aadhaar_number)}
                </span>
                {selectedCustomer.aadhaar_number && (
                  <button
                    type="button"
                    onClick={() => setShowFullAadhaar(!showFullAadhaar)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                    title={showFullAadhaar ? 'Mask Aadhaar' : 'Show Aadhaar'}
                  >
                    {showFullAadhaar ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                Residential Address
              </p>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                {selectedCustomer.address}
              </p>
            </div>

            {selectedCustomer.notes && (
              <div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <FileText className="w-3.5 h-3.5 text-amber-700" />
                  Notes & Jewellery Preferences
                </p>
                <p className="text-sm text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 mt-1 italic">
                  "{selectedCustomer.notes}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation for Sales & Payments Ledger */}
        <div>
          <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`text-sm font-semibold pb-1.5 px-2 transition-colors border-b-2 ${
                activeTab === 'overview'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sales History ({customerSales.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`text-sm font-semibold pb-1.5 px-2 transition-colors border-b-2 ${
                activeTab === 'payments'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Payment Installments ({customerPayments.length})
            </button>
          </div>

          {/* Sales History Tab */}
          {activeTab === 'overview' && (
            <div className="mt-4 space-y-3">
              {customerSales.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl">
                  <ShoppingBag className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
                  <p className="text-sm">No sales records found for this customer.</p>
                  <button
                    onClick={() => {
                      const c = selectedCustomer;
                      setSelectedCustomer(null);
                      openNewSaleForCustomer(c);
                    }}
                    className="mt-3 text-xs font-semibold text-amber-700 hover:text-amber-800 underline"
                  >
                    + Create First Gold Sale Invoice
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                        <th className="py-2.5 px-3">Invoice</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Items / Karat</th>
                        <th className="py-2.5 px-3">Gold Weight</th>
                        <th className="py-2.5 px-3">Total Amount</th>
                        <th className="py-2.5 px-3">Paid</th>
                        <th className="py-2.5 px-3">Balance</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customerSales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-amber-800">
                            {sale.invoice_number}
                          </td>
                          <td className="py-3 px-3 text-slate-700">
                            {formatDate(sale.sale_date)}
                          </td>
                          <td className="py-3 px-3 text-slate-900 max-w-[180px] truncate">
                            {sale.items && sale.items.length > 0
                              ? sale.items.map((it) => it.item_name).join(', ')
                              : 'Jewellery Items'}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-700 font-bold">
                            {formatWeight(sale.total_net_weight || sale.total_gross_weight)}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900">
                            {formatCurrency(sale.final_amount)}
                          </td>
                          <td className="py-3 px-3 text-emerald-700 font-bold">
                            {formatCurrency(sale.paid_amount)}
                          </td>
                          <td className="py-3 px-3 text-rose-700 font-bold">
                            {formatCurrency(sale.balance_amount)}
                          </td>
                          <td className="py-3 px-3">
                            {sale.payment_status === 'paid' ? (
                              <Badge variant="emerald" size="sm">Paid</Badge>
                            ) : sale.payment_status === 'partial' ? (
                              <Badge variant="gold" size="sm">Partial</Badge>
                            ) : (
                              <Badge variant="rose" size="sm">Pending</Badge>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedCustomer(null);
                                setActiveSaleDetails(sale);
                              }}
                              className="text-xs text-amber-700 hover:text-amber-800 font-bold inline-flex items-center gap-1"
                            >
                              View Bill <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="mt-4 space-y-3">
              {customerPayments.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl">
                  <Receipt className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
                  <p className="text-sm">No payment installment records found.</p>
                  <button
                    onClick={() => {
                      const c = selectedCustomer;
                      setSelectedCustomer(null);
                      openAddPaymentForCustomer(c);
                    }}
                    className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
                  >
                    + Record First Payment
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                        <th className="py-2.5 px-3">Receipt No</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Payment Mode</th>
                        <th className="py-2.5 px-3">Reference / Remarks</th>
                        <th className="py-2.5 px-3 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customerPayments.map((pymt) => (
                        <tr key={pymt.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                            {pymt.receipt_number}
                          </td>
                          <td className="py-3 px-3 text-slate-700">
                            {formatDate(pymt.payment_date)}
                          </td>
                          <td className="py-3 px-3 text-base font-bold text-emerald-700">
                            {formatCurrency(pymt.amount)}
                          </td>
                          <td className="py-3 px-3 uppercase text-slate-700">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold text-[11px]">
                              {pymt.payment_mode}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 max-w-[200px] truncate">
                            {pymt.transaction_ref || pymt.notes || '—'}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedCustomer(null);
                                setActiveReceipt(pymt);
                              }}
                              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1"
                            >
                              Print Slip <Receipt className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
