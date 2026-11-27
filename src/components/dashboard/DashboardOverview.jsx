import React from 'react';
import { useApp } from '../../context/AppContext';
import { GoldRateTicker } from './GoldRateTicker';
import { KPICards } from './KPICards';
import { SalesCharts } from './SalesCharts';
import { RecentActivity } from './RecentActivity';
import {
  PlusCircle,
  UserPlus,
  Receipt,
  ShieldCheck,
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
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Usha Jewellers CRM Dashboard
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> BIS Certified
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            {todayFormatted} • Welcome back, Store Manager
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
          <button
            onClick={() => setIsNewSaleOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all duration-150"
          >
            <PlusCircle className="w-4 h-4" />
            New Gold Sale
          </button>

          <button
            onClick={() => setIsAddPaymentOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all duration-150"
          >
            <Receipt className="w-4 h-4" />
            Record Payment
          </button>

          <button
            onClick={() => setIsNewCustomerOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-colors"
          >
            <UserPlus className="w-4 h-4 text-amber-600" />
            Add Customer
          </button>
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
