import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Receipt,
  FileBarChart2,
  Sparkles,
  X,
  ChevronRight
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    rates,
    setIsRatesModalOpen,
    setIsSupabaseModalOpen,
    isSupabaseConfigured,
    customers,
    sales,
    payments
  } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'customers',
      label: 'Customer Management',
      icon: Users,
      badge: customers.length
    },
    {
      id: 'sales',
      label: 'Gold Sales & Invoices',
      icon: ShoppingBag,
      badge: sales.length
    },
    {
      id: 'payments',
      label: 'Installments & Payments',
      icon: Receipt,
      badge: payments.length
    },
    {
      id: 'reports',
      label: 'Reports & Aging Ledger',
      icon: FileBarChart2,
      badge: null
    }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between z-40 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } no-print shadow-xs`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo & Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center shadow-sm text-white font-serif font-black text-xl">
                U
              </div>
              <div>
                <h2 className="font-serif font-bold text-base text-slate-900 tracking-wide">
                  USHA JEWELLERS
                </h2>
                <p className="text-[10px] text-amber-700 font-semibold tracking-wider uppercase">
                  CRM & Sales Suite
                </p>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-1.5 flex-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Main Navigation
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-amber-700' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive
                          ? 'bg-amber-200/80 text-amber-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Gold Ticker Mini Card in Sidebar */}
          <div className="p-3 mx-3 mb-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" /> Gold 22K (916)
              </span>
              <button
                onClick={() => setIsRatesModalOpen(true)}
                className="text-[10px] text-amber-700 hover:text-amber-900 font-semibold underline"
              >
                Edit
              </button>
            </div>
            <p className="text-base font-bold font-mono text-slate-900">
              ₹{Number(rates?.karat_22k || 7200).toLocaleString('en-IN')}{' '}
              <span className="text-xs text-slate-500 font-normal">/ gram</span>
            </p>
          </div>

          {/* Supabase Connection Status at Bottom */}
          <div className="p-3 border-t border-slate-100">
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {isSupabaseConfigured ? 'Supabase Postgres' : 'Local Demo Mode'}
                  </p>
                  <p className="text-[10px] text-slate-500">Settings & SQL Schema</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
