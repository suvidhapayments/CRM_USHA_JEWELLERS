import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  formatCurrency,
  formatMobile,
  maskAadhaar
} from '../../utils/formatters';
import {
  UserPlus,
  Search,
  Download,
  LayoutGrid,
  List,
  Phone,
  MapPin,
  CreditCard,
  PlusCircle,
  Receipt,
  User,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export const CustomerList = () => {
  const {
    customers,
    searchQuery,
    setSearchQuery,
    setIsNewCustomerOpen,
    setSelectedCustomer,
    setEditingCustomer,
    openNewSaleForCustomer,
    openAddPaymentForCustomer
  } = useApp();

  const [filterType, setFilterType] = useState('all'); // 'all', 'outstanding', 'cleared'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Filter & Search customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      // Filter status
      const hasBalance = Number(cust.outstanding_balance || 0) > 0;
      if (filterType === 'outstanding' && !hasBalance) return false;
      if (filterType === 'cleared' && hasBalance) return false;

      // Search match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = cust.name?.toLowerCase().includes(q);
      const phoneMatch = cust.mobile?.includes(q) || cust.alternate_mobile?.includes(q);
      const codeMatch = cust.customer_code?.toLowerCase().includes(q);
      const aadhaarMatch = cust.aadhaar_number?.includes(q);
      const addressMatch = cust.address?.toLowerCase().includes(q);

      return nameMatch || phoneMatch || codeMatch || aadhaarMatch || addressMatch;
    });
  }, [customers, searchQuery, filterType]);

  // Aggregate stats
  const totalCustomersCount = customers.length;
  const customersWithBalance = customers.filter((c) => Number(c.outstanding_balance || 0) > 0);
  const totalOutstandingSum = customers.reduce((acc, c) => acc + Number(c.outstanding_balance || 0), 0);
  const totalPurchasesSum = customers.reduce((acc, c) => acc + Number(c.total_purchased || 0), 0);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Customer Code', 'Name', 'Mobile', 'Alternate Mobile', 'Address', 'Aadhaar', 'Total Purchased', 'Total Paid', 'Outstanding Balance', 'Created Date'];
    const rows = filteredCustomers.map(c => [
      c.customer_code,
      `"${c.name}"`,
      c.mobile,
      c.alternate_mobile || '',
      `"${c.address?.replace(/"/g, '""')}"`,
      c.aadhaar_number || '',
      c.total_purchased || 0,
      c.total_paid || 0,
      c.outstanding_balance || 0,
      c.created_at || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `usha_jewellers_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-500">Total Registered</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCustomersCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">Active Jewellery Clients</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
            <User className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-500">Pending Installments</p>
            <p className="text-2xl font-bold text-rose-700 mt-1">{formatCurrency(totalOutstandingSum)}</p>
            <p className="text-xs text-rose-600 mt-0.5">{customersWithBalance.length} customers with balance</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-500">Lifetime Purchases</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{formatCurrency(totalPurchasesSum)}</p>
            <p className="text-xs text-emerald-600 mt-0.5">Gross Customer Sales</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Bar (Search, Filters, New Customer) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Mobile, Customer ID (e.g. CUST-2026-001), Aadhaar..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({customers.length})
          </button>
          <button
            onClick={() => setFilterType('outstanding')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'outstanding'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            With Balance ({customersWithBalance.length})
          </button>
          <button
            onClick={() => setFilterType('cleared')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'cleared'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Zero Balance ({customers.length - customersWithBalance.length})
          </button>
        </div>

        {/* Action Buttons & View Mode */}
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Export Customers CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsNewCustomerOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-sm shadow-xs transition-all duration-150"
          >
            <UserPlus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Customer List Content */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <User className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No customers found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {searchQuery
              ? `No customer matching "${searchQuery}". Try searching by another keyword or customer code.`
              : 'Start by creating your first gold jewellery customer record.'}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setIsNewCustomerOpen(true); }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white font-bold rounded-xl text-xs hover:bg-amber-700 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            Add New Customer
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((cust) => {
            const hasBal = Number(cust.outstanding_balance || 0) > 0;
            return (
              <div
                key={cust.id}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-amber-50 border border-amber-200 flex-shrink-0 flex items-center justify-center">
                        {cust.photo_url ? (
                          <img
                            src={cust.photo_url}
                            alt={cust.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-amber-700" />
                        )}
                      </div>
                      <div>
                        <h4
                          onClick={() => setSelectedCustomer(cust)}
                          className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors cursor-pointer text-base line-clamp-1"
                        >
                          {cust.name}
                        </h4>
                        <span className="inline-block font-mono text-xs text-amber-700 font-bold">
                          {cust.customer_code}
                        </span>
                      </div>
                    </div>

                    {hasBal ? (
                      <Badge variant="rose" size="sm">Due</Badge>
                    ) : (
                      <Badge variant="emerald" size="sm">Cleared</Badge>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">{formatMobile(cust.mobile)}</span>
                    </div>

                    <div className="flex items-start gap-2 text-slate-500 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="truncate">{cust.address}</span>
                    </div>

                    {cust.aadhaar_number && (
                      <div className="flex items-center gap-2 text-slate-500 font-mono">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        <span>{maskAadhaar(cust.aadhaar_number)}</span>
                      </div>
                    )}
                  </div>

                  {/* Financial Bar */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Total Bought</p>
                      <p className="font-bold text-slate-900 mt-0.5">{formatCurrency(cust.total_purchased)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Outstanding</p>
                      <p className={`font-bold mt-0.5 ${hasBal ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {formatCurrency(cust.outstanding_balance)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedCustomer(cust)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
                  >
                    View Ledger <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openNewSaleForCustomer(cust)}
                      className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
                      title="Create Gold Sale"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openAddPaymentForCustomer(cust)}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      title="Record Payment / Installment"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingCustomer(cust)}
                      className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High Density Table View */
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Customer ID</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Aadhaar (KYC)</th>
                  <th className="py-3 px-4 text-right">Total Purchases</th>
                  <th className="py-3 px-4 text-right">Outstanding</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => {
                  const hasBal = Number(cust.outstanding_balance || 0) > 0;
                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-amber-50 border border-amber-200 flex-shrink-0 flex items-center justify-center">
                            {cust.photo_url ? (
                              <img src={cust.photo_url} alt={cust.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-amber-700" />
                            )}
                          </div>
                          <div>
                            <button
                              onClick={() => setSelectedCustomer(cust)}
                              className="font-bold text-slate-900 hover:text-amber-700 transition-colors text-left"
                            >
                              {cust.name}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-800">
                        {cust.customer_code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {formatMobile(cust.mobile)}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">
                        {cust.address}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {maskAadhaar(cust.aadhaar_number)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {formatCurrency(cust.total_purchased)}
                      </td>
                      <td className={`py-3 px-4 text-right font-bold ${hasBal ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {formatCurrency(cust.outstanding_balance)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {hasBal ? (
                          <Badge variant="rose" size="sm">Due</Badge>
                        ) : (
                          <Badge variant="emerald" size="sm">Cleared</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="p-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                            title="View Customer Ledger"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openNewSaleForCustomer(cust)}
                            className="p-1 text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded transition-colors"
                            title="New Sale"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openAddPaymentForCustomer(cust)}
                            className="p-1 text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
                            title="Record Payment"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
