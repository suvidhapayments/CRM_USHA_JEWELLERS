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
  FileText
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
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-500">Total Gold Sold</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">{formatWeight(totalGoldGrams)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{sales.length} Invoices generated</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-500">Total Sales Value</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalSalesSum)}</p>
          <p className="text-xs text-slate-500 mt-0.5">Gross Revenue</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-500">Amount Received</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{formatCurrency(totalPaidSum)}</p>
          <p className="text-xs text-emerald-600 mt-0.5">Cleared at counter / bank</p>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-500">Outstanding Balance</p>
          <p className="text-2xl font-bold text-rose-700 mt-1">{formatCurrency(totalBalanceSum)}</p>
          <p className="text-xs text-rose-600 mt-0.5">Pending installments</p>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Invoice (INV-2026-101), Customer Name, or Jewellery Item..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Sales ({sales.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === 'paid'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Paid ({sales.filter(s => s.payment_status === 'paid').length})
          </button>
          <button
            onClick={() => setStatusFilter('partial')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === 'partial'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Installments ({sales.filter(s => s.payment_status === 'partial').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Export Sales CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsNewSaleOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-sm shadow-xs transition-all duration-150"
          >
            <PlusCircle className="w-4 h-4" />
            New Gold Sale
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Jewellery Items</th>
                <th className="py-3 px-4 text-right">Net Gold Wt</th>
                <th className="py-3 px-4 text-right">Invoice Amount</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2 opacity-50" />
                    No sales invoices found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => {
                  const hasBal = Number(sale.balance_amount || 0) > 0;
                  const cust = customers.find((c) => c.id === sale.customer_id);

                  return (
                    <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-800">
                        {sale.invoice_number}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div>{sale.customer_name}</div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {sale.customer_code}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {formatDate(sale.sale_date)}
                      </td>
                      <td className="py-3 px-4 text-slate-800 max-w-[220px]">
                        <p className="truncate font-medium">
                          {sale.items && sale.items.length > 0
                            ? sale.items.map((i) => i.item_name).join(', ')
                            : 'Gold Ornaments'}
                        </p>
                        <span className="text-[11px] text-amber-700 font-mono">
                          {sale.items?.length || 0} item(s)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-800">
                        {formatWeight(sale.total_net_weight || sale.total_gross_weight)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm">
                        {formatCurrency(sale.final_amount)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">
                        {formatCurrency(sale.paid_amount)}
                      </td>
                      <td className={`py-3 px-4 text-right font-bold ${hasBal ? 'text-rose-700' : 'text-slate-400'}`}>
                        {formatCurrency(sale.balance_amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {sale.payment_status === 'paid' ? (
                          <Badge variant="emerald" size="sm">Paid</Badge>
                        ) : sale.payment_status === 'partial' ? (
                          <Badge variant="gold" size="sm">Partial</Badge>
                        ) : (
                          <Badge variant="rose" size="sm">Pending</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveSaleDetails(sale)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Bill <FileText className="w-3 h-3" />
                          </button>
                          {hasBal && (
                            <button
                              onClick={() => openAddPaymentForCustomer(cust, sale)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                              title="Record Installment"
                            >
                              Pay <Receipt className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
