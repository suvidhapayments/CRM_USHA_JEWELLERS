import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { formatCurrency, formatWeight } from '../../utils/formatters';
import {
  Users,
  Scale,
  BadgeIndianRupee,
  Receipt,
  AlertCircle,
  TrendingUp,
  Banknote,
  Clock
} from 'lucide-react';

export const KPICards = () => {
  const { metrics, setActiveTab } = useApp();

  if (!metrics || !metrics.kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-800/40 rounded-2xl border border-slate-800" />
        ))}
      </div>
    );
  }

  const { kpis } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Customers */}
      <StatCard
        title="Total Customers"
        value={kpis.totalCustomers}
        subtitle="Registered jewellery buyers"
        icon={Users}
        accent="blue"
        trend="up"
        trendValue="+12% this mo"
        onClick={() => setActiveTab('customers')}
      />

      {/* 2. Total Gold Sold (in grams) */}
      <StatCard
        title="Total Gold Sold"
        value={formatWeight(kpis.totalGoldSoldGrams)}
        subtitle="Hallmarked 22K & 24K"
        icon={Scale}
        accent="gold"
        trend="up"
        trendValue="Active weight"
        onClick={() => setActiveTab('sales')}
      />

      {/* 3. Total Sales Amount (₹) */}
      <StatCard
        title="Total Sales Amount"
        value={formatCurrency(kpis.totalSalesAmount)}
        subtitle="Gross revenue billed"
        icon={BadgeIndianRupee}
        accent="purple"
        trend="up"
        trendValue="Cumulative"
        onClick={() => setActiveTab('sales')}
      />

      {/* 4. Total Amount Received (₹) */}
      <StatCard
        title="Total Received"
        value={formatCurrency(kpis.totalAmountReceived)}
        subtitle="Cleared payments & cash"
        icon={Receipt}
        accent="emerald"
        trend="up"
        trendValue="86.7% realized"
        onClick={() => setActiveTab('payments')}
      />

      {/* 5. Total Outstanding Amount (₹) */}
      <StatCard
        title="Total Outstanding"
        value={formatCurrency(kpis.totalOutstandingAmount)}
        subtitle="Pending customer balances"
        icon={AlertCircle}
        accent="rose"
        trend="down"
        trendValue="Installments due"
        onClick={() => setActiveTab('customers')}
      />

      {/* 6. Today's Sales */}
      <StatCard
        title="Today's Sales"
        value={formatCurrency(kpis.todaySales)}
        subtitle="Invoiced today"
        icon={TrendingUp}
        accent="gold"
        trend="up"
        trendValue="Active today"
        onClick={() => setActiveTab('sales')}
      />

      {/* 7. Today's Collections */}
      <StatCard
        title="Today's Collections"
        value={formatCurrency(kpis.todayCollections)}
        subtitle="Received today"
        icon={Banknote}
        accent="emerald"
        trend="up"
        trendValue="Counter + RTGS"
        onClick={() => setActiveTab('payments')}
      />

      {/* 8. Total Pending Payments */}
      <StatCard
        title="Pending Invoices"
        value={`${kpis.totalPendingPaymentsCount} Bills`}
        subtitle={`${formatCurrency(kpis.totalPendingPaymentsAmount)} payable`}
        icon={Clock}
        accent="rose"
        trend="down"
        trendValue="Needs follow-up"
        onClick={() => setActiveTab('sales')}
      />
    </div>
  );
};
