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
  ChevronRight,
  Gem
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
      label: 'Reports & Analytics',
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
          className="fixed inset-0 bg-navy-950/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-100 flex flex-col justify-between z-40 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } no-print shadow-[4px_0_24px_rgba(7,1,39,0.02)]`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo & Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1E65FF] via-blue-500 to-indigo-500 flex items-center justify-center shadow-[0_4px_12px_rgba(30,101,255,0.3)] text-white font-black text-xl">
                <Gem className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-navy-950 tracking-tight">
                  USHA JEWELLERS
                </h2>
                <p className="text-[10px] text-[#1E65FF] font-bold tracking-wider uppercase">
                  Gold CRM Suite
                </p>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-navy-950 rounded-lg lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3.5 py-5 space-y-1.5 flex-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Menu
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold transition-all group ${
                    isActive
                      ? 'bg-[#1E65FF] text-white shadow-[0_4px_14px_rgba(30,101,255,0.35)]'
                      : 'text-slate-600 hover:text-navy-950 hover:bg-[#F4F6FB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-navy-950'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
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
          <div className="p-3.5 mx-3 mb-3 bg-gradient-to-br from-amber-50/80 to-white border border-amber-200/80 rounded-2xl space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" /> Gold 22K (916)
              </span>
              <button
                onClick={() => setIsRatesModalOpen(true)}
                className="text-[10px] text-[#1E65FF] hover:underline font-bold"
              >
                Update
              </button>
            </div>
            <p className="text-base font-extrabold font-mono text-navy-950">
              ₹{Number(rates?.karat_22k || 7200).toLocaleString('en-IN')}{' '}
              <span className="text-xs text-slate-500 font-normal">/ gram</span>
            </p>
          </div>

          {/* Supabase Connection Status at Bottom */}
          <div className="p-3 border-t border-slate-100">
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F0F5FF] border border-slate-200/70 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isSupabaseConfigured ? 'bg-emerald-500' : 'bg-brand-500'
                  }`}
                />
                <div>
                  <p className="text-xs font-bold text-navy-950">
                    {isSupabaseConfigured ? 'Supabase Postgres' : 'Local Mock DB'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">Settings & Schema</p>
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
