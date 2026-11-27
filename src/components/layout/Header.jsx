import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Database,
  PlusCircle,
  Search,
  Gem
} from 'lucide-react';

export const Header = ({ onOpenMobileMenu }) => {
  const {
    isSupabaseConfigured,
    setIsSupabaseModalOpen,
    setIsNewSaleOpen,
    searchQuery,
    setSearchQuery,
    setActiveTab,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-3 sm:px-6 py-2.5 sm:py-3 shadow-[0_2px_15px_-3px_rgba(7,1,39,0.03)] no-print">
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 text-slate-600 hover:text-navy-950 rounded-full hover:bg-slate-100 lg:hidden transition-colors"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#1E65FF] via-blue-500 to-indigo-500 flex items-center justify-center shadow-[0_4px_12px_rgba(30,101,255,0.3)] text-white font-black text-lg">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-extrabold text-navy-950 tracking-tight">
                  USHA JEWELLERS
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] bg-brand-50 text-[#1E65FF] border border-brand-200 font-bold uppercase tracking-wider">
                  CRM
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">
                Gold Jewellery & Sales Management
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search Input (Desktop & Tablet) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) setActiveTab('customers');
              }}
              placeholder="Search customer, mobile, invoice number..."
              className="w-full bg-[#F4F6FB] border border-slate-200/70 rounded-full pl-10 pr-4 py-2 text-xs text-navy-950 placeholder-slate-400 focus:outline-none focus:border-[#1E65FF] focus:bg-white focus:ring-2 focus:ring-brand-100 transition-all font-medium"
            />
          </div>
        </div>

        {/* Right: Quick Actions & Database Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Database Status Button */}
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-semibold transition-all ${
              isSupabaseConfigured
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-brand-50 text-[#1E65FF] border-brand-200 hover:bg-brand-100'
            }`}
            title="Configure Database & Supabase connection"
          >
            <Database className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden xs:inline">
              {isSupabaseConfigured ? 'Supabase' : 'Local DB'}
            </span>
          </button>

          {/* Quick Add Button - Pill button styled like the "Register Now" / "Start trial" button */}
          <button
            onClick={() => setIsNewSaleOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-[#1E65FF] hover:bg-[#1554E8] text-white font-bold rounded-full text-xs shadow-[0_4px_14px_rgba(30,101,255,0.35)] hover:shadow-[0_6px_20px_rgba(30,101,255,0.45)] transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">New Sale</span>
            <span className="xs:hidden">Sale</span>
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-navy-950 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              UJ
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
