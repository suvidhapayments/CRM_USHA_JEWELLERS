import React from 'react';
import { useApp } from '../../context/AppContext';
import { GoldRateTicker } from './GoldRateTicker';
import { KPICards } from './KPICards';
import { SalesCharts } from './SalesCharts';
import { RecentActivity } from './RecentActivity';
import { DashboardHeroIllustration } from '../illustrations/DashboardHeroIllustration';
import {
  PlusCircle,
  UserPlus,
  Receipt,
  Sparkles,
  Calendar
} from 'lucide-react';

export const DashboardOverview = () => {
  const {
    setIsNewSaleOpen,
    setIsNewCustomerOpen,
    setIsAddPaymentOpen,
  } = useApp();

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Welcome Banner with Modern Illustration */}
      <div className="relative overflow-hidden bg-white border border-[#F1F4F9] p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
        {/* Subtle decorative glowing background blur */}
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-brand-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Text & CTA Column */}
          <div className="flex-1 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-[#1E65FF] border border-brand-200/60 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Jewellery Retail CRM</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
              Best tools to manage your <span className="text-[#1E65FF]">gold jewellery</span> store
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1E65FF] flex-shrink-0" />
              <span>{todayFormatted} • Hallmarked sales, customer KYC & payment installments</span>
            </p>

            {/* Quick Action Pill Buttons */}
            <div className="flex items-center gap-3 flex-wrap mt-6">
              <button
                onClick={() => setIsNewSaleOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1E65FF] hover:bg-[#1554E8] text-white font-bold rounded-full text-xs sm:text-sm shadow-[0_4px_16px_rgba(30,101,255,0.35)] hover:shadow-[0_6px_22px_rgba(30,101,255,0.45)] transition-all active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4" />
                New Gold Bill
              </button>

              <button
                onClick={() => setIsAddPaymentOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-navy-950 hover:bg-navy-900 text-white font-bold rounded-full text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98]"
              >
                <Receipt className="w-4 h-4 text-brand-300" />
                Record Payment
              </button>

              <button
                onClick={() => setIsNewCustomerOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#F4F6FB] hover:bg-slate-200 text-navy-950 font-bold rounded-full text-xs sm:text-sm transition-colors"
              >
                <UserPlus className="w-4 h-4 text-[#1E65FF]" />
                Add Customer
              </button>
            </div>
          </div>

          {/* Right Column: Character Illustration */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end flex-shrink-0">
            <DashboardHeroIllustration className="w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[440px] h-auto" />
          </div>
        </div>
      </div>

      {/* Live Gold & Silver Rate Board */}
      <GoldRateTicker />

      {/* 8 Primary KPI Cards */}
      <KPICards />

      {/* Visual Analytics & Charts */}
      <SalesCharts />

      {/* Recent Sales & Payment Activity Tables */}
      <RecentActivity />
    </div>
  );
};
