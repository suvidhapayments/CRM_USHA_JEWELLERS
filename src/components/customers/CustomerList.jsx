import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { EmptyStateIllustration } from '../illustrations/EmptyStateIllustration';
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
        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)] flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Total Registered</p>
            <p className="text-2xl font-extrabold text-navy-950 mt-1">{totalCustomersCount}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Active Jewellery Clients</p>
          </div>
          <div className="p-3 bg-brand-50 text-[#1E65FF] rounded-2xl border border-brand-100 shadow-2xs">
            <User className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)] flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Pending Installments</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">{formatCurrency(totalOutstandingSum)}</p>
            <p className="text-xs text-rose-600 mt-0.5 font-medium">{customersWithBalance.length} customers with balance</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 shadow-2xs">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#F1F4F9] p-5 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)] flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Lifetime Purchases</p>
            <p className="text-2xl font-extrabold text-[#1E65FF] mt-1">{formatCurrency(totalPurchasesSum)}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Gross Customer Sales</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-2xs">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Bar (Search, Filters, New Customer) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#F1F4F9] shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Mobile, Customer ID (e.g. CUST-2026-001), Aadhaar..."
            className="w-full bg-[#F4F6FB] border border-slate-200/70 rounded-full pl-10 pr-4 py-2.5 text-xs text-navy-950 placeholder-slate-400 focus:outline-none focus:border-[#1E65FF] focus:bg-white font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2.5 text-xs text-slate-400 hover:text-navy-950 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#F4F6FB] p-1 rounded-full border border-slate-200/70 text-xs overflow-x-auto pb-1 md:pb-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              filterType === 'all'
                ? 'bg-[#1E65FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            All ({customers.length})
          </button>
          <button
            onClick={() => setFilterType('outstanding')}
            className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              filterType === 'outstanding'
                ? 'bg-[#1E65FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            With Balance ({customersWithBalance.length})
          </button>
          <button
            onClick={() => setFilterType('cleared')}
            className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              filterType === 'cleared'
                ? 'bg-[#1E65FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            Zero Balance ({customers.length - customersWithBalance.length})
          </button>
        </div>

        {/* Action Buttons & View Mode */}
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="hidden sm:flex items-center bg-[#F4F6FB] p-1 rounded-full border border-slate-200/70">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-[#1E65FF]' : 'text-slate-400 hover:text-navy-950'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'table' ? 'bg-white shadow-xs text-[#1E65FF]' : 'text-slate-400 hover:text-navy-950'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:text-navy-950 hover:bg-slate-200 border border-slate-200/70 transition-colors"
            title="Export Customers CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsNewCustomerOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E65FF] hover:bg-[#1554E8] text-white font-bold rounded-full text-xs shadow-[0_4px_14px_rgba(30,101,255,0.35)] transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Customer List Content */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white border border-[#F1F4F9] rounded-3xl p-10 sm:p-12 text-center shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
          <EmptyStateIllustration type="customers" className="w-36 h-36 mx-auto mb-2" />
          <h3 className="text-lg font-extrabold text-navy-950">No customers found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto font-medium">
            {searchQuery
              ? `No customer matching "${searchQuery}". Try searching by another keyword or customer code.`
              : 'Start by creating your first gold jewellery customer record.'}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setIsNewCustomerOpen(true); }}
            className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-[#1E65FF] hover:bg-[#1554E8] text-white font-bold rounded-full text-xs shadow-[0_4px_14px_rgba(30,101,255,0.35)] transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add New Customer
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.map((cust) => {
            const hasBal = Number(cust.outstanding_balance || 0) > 0;
            return (
              <div
                key={cust.id}
                className="bg-white border border-[#F1F4F9] hover:border-brand-300 rounded-3xl p-5 shadow-[0_8px_30px_rgba(7,1,39,0.04)] hover:shadow-[0_14px_34px_rgba(7,1,39,0.08)] transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-brand-50 border border-brand-100 flex-shrink-0 flex items-center justify-center">
                        {cust.photo_url ? (
                          <img
                            src={cust.photo_url}
                            alt={cust.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-[#1E65FF]" />
                        )}
                      </div>
                      <div>
                        <h4
                          onClick={() => setSelectedCustomer(cust)}
                          className="font-extrabold text-navy-950 group-hover:text-[#1E65FF] transition-colors cursor-pointer text-base line-clamp-1 tracking-tight"
                        >
                          {cust.name}
                        </h4>
                        <span className="inline-block font-mono text-xs text-[#1E65FF] font-bold">
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
                      <span className="font-semibold text-navy-950">{formatMobile(cust.mobile)}</span>
                    </div>

                    <div className="flex items-start gap-2 text-slate-500 line-clamp-1 font-medium">
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
                      <p className="text-[10px] uppercase font-bold text-slate-400">Total Bought</p>
                      <p className="font-extrabold text-navy-950 mt-0.5">{formatCurrency(cust.total_purchased)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Outstanding</p>
                      <p className={`font-extrabold mt-0.5 ${hasBal ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {formatCurrency(cust.outstanding_balance)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedCustomer(cust)}
                    className="text-xs font-bold text-[#1E65FF] hover:underline inline-flex items-center gap-1 transition-colors"
                  >
                    View Ledger <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openNewSaleForCustomer(cust)}
                      className="p-1.5 rounded-full bg-brand-50 text-[#1E65FF] hover:bg-brand-100 border border-brand-200 transition-colors"
                      title="Create Gold Sale"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openAddPaymentForCustomer(cust)}
                      className="p-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      title="Record Payment / Installment"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingCustomer(cust)}
                      className="text-xs font-bold text-slate-600 hover:text-navy-950 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
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
        <div className="bg-white border border-[#F1F4F9] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAFC] text-slate-500 uppercase tracking-wider font-bold">
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
                    <tr key={cust.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl overflow-hidden bg-brand-50 border border-brand-100 flex-shrink-0 flex items-center justify-center">
                            {cust.photo_url ? (
                              <img src={cust.photo_url} alt={cust.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-[#1E65FF]" />
                            )}
                          </div>
                          <div>
                            <button
                              onClick={() => setSelectedCustomer(cust)}
                              className="font-extrabold text-navy-950 hover:text-[#1E65FF] transition-colors text-left"
                            >
                              {cust.name}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#1E65FF]">
                        {cust.customer_code}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {formatMobile(cust.mobile)}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-[150px] truncate">
                        {cust.address}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {cust.aadhaar_number ? maskAadhaar(cust.aadhaar_number) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-navy-950">
                        {formatCurrency(cust.total_purchased)}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold">
                        <span className={hasBal ? 'text-rose-600' : 'text-emerald-600'}>
                          {formatCurrency(cust.outstanding_balance)}
                        </span>
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
                            onClick={() => openNewSaleForCustomer(cust)}
                            className="p-1.5 rounded-full bg-brand-50 text-[#1E65FF] hover:bg-brand-100 transition-colors"
                            title="New Gold Sale"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openAddPaymentForCustomer(cust)}
                            className="p-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="Add Payment"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="px-3 py-1 rounded-full text-xs font-bold text-slate-600 hover:text-navy-950 bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            View
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
