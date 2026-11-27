import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  formatCurrency,
  formatDate,
  formatWeight
} from '../../utils/formatters';
import {
  PlusCircle,
  Search,
  Download,
  Receipt,
  FileText,
  Scale
} from 'lucide-react';

export const SalesList = () => {
  const {
    sales,
    customers,
    setIsNewSaleOpen,
    setActiveSaleDetails,
    openAddPaymentForCustomer
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      if (statusFilter !== 'all' && sale.payment_status !== statusFilter) return false;

      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      const invMatch = sale.invoice_number?.toLowerCase().includes(q);
      const custMatch = sale.customer_name?.toLowerCase().includes(q) || sale.customer_code?.toLowerCase().includes(q);
      const itemMatch = sale.items?.some((i) => i.item_name?.toLowerCase().includes(q));

      return invMatch || custMatch || itemMatch;
    });
  }, [sales, searchTerm, statusFilter]);

  const totalSalesSum = sales.reduce((acc, s) => acc + Number(s.final_amount || 0), 0);
  const totalGoldGrams = sales.reduce((acc, s) => acc + Number(s.total_net_weight || s.total_gross_weight || 0), 0);
  const totalPaidSum = sales.reduce((acc, s) => acc + Number(s.paid_amount || 0), 0);
  const totalBalanceSum = sales.reduce((acc, s) => acc + Number(s.balance_amount || 0), 0);

  const handleExportCSV = () => {
    const headers = ['Invoice Number', 'Customer', 'Date', 'Gross Wt (g)', 'Net Wt (g)', 'Subtotal', 'Making', 'GST', 'Grand Total', 'Paid', 'Balance', 'Status'];
    const rows = filteredSales.map((s) => [
      s.invoice_number,
      `"${s.customer_name}"`,
      s.sale_date,
      s.total_gross_weight,
      s.total_net_weight,
      s.subtotal,
      s.making_charges,
      s.gst_amount,
      s.final_amount,
      s.paid_amount,
      s.balance_amount,
      s.payment_status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `usha_jewellers_sales_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Sales KPI Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
          <p className="text-xs uppercase font-bold text-slate-400">Total Gold Sold</p>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{formatWeight(totalGoldGrams)}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{sales.length} Invoices generated</p>
        </div>

        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
          <p className="text-xs uppercase font-bold text-slate-400">Total Sales Value</p>
          <p className="text-2xl font-extrabold text-navy-950 mt-1">{formatCurrency(totalSalesSum)}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Gross Revenue</p>
        </div>

        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
          <p className="text-xs uppercase font-bold text-slate-400">Amount Received</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{formatCurrency(totalPaidSum)}</p>
          <p className="text-xs text-emerald-600 mt-0.5 font-medium">Cleared at counter / bank</p>
        </div>

        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
          <p className="text-xs uppercase font-bold text-slate-400">Outstanding Balance</p>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">{formatCurrency(totalBalanceSum)}</p>
          <p className="text-xs text-rose-600 mt-0.5 font-medium">Pending customer installments</p>
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
            placeholder="Search by Invoice (e.g. INV-2026-001), Customer Name, Ornament..."
            className="w-full bg-[#F4F6FB] border border-slate-200/70 rounded-full pl-10 pr-4 py-2.5 text-xs text-navy-950 placeholder-slate-400 focus:outline-none focus:border-[#1E65FF] focus:bg-white font-medium"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-[#F4F6FB] p-1 rounded-full border border-slate-200/70 text-xs overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              statusFilter === 'all' ? 'bg-[#1E65FF] text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            All Bills
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              statusFilter === 'paid' ? 'bg-[#1E65FF] text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            Fully Paid
          </button>
          <button
            onClick={() => setStatusFilter('partial')}
            className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              statusFilter === 'partial' ? 'bg-[#1E65FF] text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            Partially Paid
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              statusFilter === 'pending' ? 'bg-[#1E65FF] text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            Unpaid
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:text-navy-950 hover:bg-slate-200 border border-slate-200/70 transition-colors"
            title="Export Sales CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsNewSaleOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E65FF] hover:bg-[#1554E8] text-white font-bold rounded-full text-xs shadow-[0_4px_14px_rgba(30,101,255,0.35)] transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            Create Gold Bill
          </button>
        </div>
      </div>

      {/* Sales Invoices Table */}
      <div className="bg-white border border-[#F1F4F9] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
        {filteredSales.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-extrabold text-navy-950">No sales invoices found</h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Try another search keyword or generate a new jewellery invoice.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAFC] text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Jewellery Items</th>
                  <th className="py-3 px-4 text-right">Net Wt</th>
                  <th className="py-3 px-4 text-right">Grand Total</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1E65FF]">
                      <button
                        onClick={() => setActiveSaleDetails(sale)}
                        className="hover:underline font-bold text-[#1E65FF]"
                      >
                        {sale.invoice_number}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-extrabold text-navy-950">{sale.customer_name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{sale.customer_code}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {formatDate(sale.sale_date)}
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate">
                      {sale.items && sale.items.length > 0 ? (
                        <span>
                          {sale.items.map((i) => `${i.item_name} (${i.karat})`).join(', ')}
                        </span>
                      ) : (
                        <span className="text-slate-400">Gold Jewellery</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                      {formatWeight(sale.total_net_weight || sale.total_gross_weight)}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-navy-950">
                      {formatCurrency(sale.final_amount)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">
                      {formatCurrency(sale.paid_amount)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      {Number(sale.balance_amount) > 0 ? (
                        <span className="text-rose-600 font-extrabold">{formatCurrency(sale.balance_amount)}</span>
                      ) : (
                        <span className="text-slate-400 font-mono">₹0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {sale.payment_status === 'paid' ? (
                        <Badge variant="emerald" size="sm">Paid</Badge>
                      ) : sale.payment_status === 'partial' ? (
                        <Badge variant="blue" size="sm">Partial</Badge>
                      ) : (
                        <Badge variant="rose" size="sm">Unpaid</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {Number(sale.balance_amount) > 0 && (
                          <button
                            onClick={() => {
                              const cust = customers.find((c) => c.id === sale.customer_id);
                              if (cust) openAddPaymentForCustomer(cust, sale);
                            }}
                            className="p-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="Collect Installment"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setActiveSaleDetails(sale)}
                          className="px-3 py-1 rounded-full text-xs font-bold bg-[#F4F6FB] hover:bg-brand-50 text-navy-950 hover:text-[#1E65FF] transition-colors"
                        >
                          Invoice
                        </button>
                      </div>
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
