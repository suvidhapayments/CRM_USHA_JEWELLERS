import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Database,
  PlusCircle,
  Search
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
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 shadow-2xs no-print">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 lg:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center shadow-sm text-white font-serif font-black text-lg">
              U
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-wide font-serif">
                  USHA JEWELLERS
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-semibold uppercase">
                  CRM
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-sans">
                Gold Shop & Installments Management
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) setActiveTab('customers');
              }}
              placeholder="Search customer, phone, invoice, Aadhaar..."
              className="w-full bg-slate-100/90 border border-slate-200 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Right: Quick Actions & Database Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Database Status Button */}
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isSupabaseConfigured
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="Configure Database & Supabase connection"
          >
            <Database className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">
              {isSupabaseConfigured ? 'Supabase Live' : 'Demo Mode (Local DB)'}
            </span>
          </button>

          {/* Quick Add Buttons on Desktop */}
          <button
            onClick={() => setIsNewSaleOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Bill
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 overflow-hidden flex items-center justify-center text-xs font-bold text-amber-800">
              VJ
            </div>
            <div className="hidden xl:block text-left text-xs">
              <p className="font-semibold text-slate-800 leading-tight">Vivek (Manager)</p>
              <p className="text-[10px] text-slate-500">Main Showroom</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
