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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-28 sm:h-32 bg-slate-200/60 rounded-2xl" />
        ))}
      </div>
    );
  }

  const { kpis } = metrics;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Customers */}
      <StatCard
        title="Total Customers"
        value={kpis.totalCustomers}
        subtitle="Registered buyers"
        icon={Users}
        accent="blue"
        trend="up"
        trendValue="+12%"
        onClick={() => setActiveTab('customers')}
      />

      {/* 2. Total Gold Sold (in grams) */}
      <StatCard
        title="Total Gold Sold"
        value={formatWeight(kpis.totalGoldSoldGrams)}
        subtitle="22K & 24K"
        icon={Scale}
        accent="gold"
        trend="up"
        trendValue="Volume"
        onClick={() => setActiveTab('sales')}
      />

      {/* 3. Total Sales Amount (₹) */}
      <StatCard
        title="Total Sales"
        value={formatCurrency(kpis.totalSalesAmount)}
        subtitle="Gross revenue"
        icon={BadgeIndianRupee}
        accent="purple"
        trend="up"
        trendValue="Billed"
        onClick={() => setActiveTab('sales')}
      />

      {/* 4. Total Amount Received (₹) */}
      <StatCard
        title="Total Received"
        value={formatCurrency(kpis.totalAmountReceived)}
        subtitle="Cleared payments"
        icon={Receipt}
        accent="emerald"
        trend="up"
        trendValue="86.7%"
        onClick={() => setActiveTab('payments')}
      />

      {/* 5. Total Outstanding Amount (₹) */}
      <StatCard
        title="Outstanding"
        value={formatCurrency(kpis.totalOutstandingAmount)}
        subtitle="Pending credit"
        icon={AlertCircle}
        accent="rose"
        trend="down"
        trendValue="Due"
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
        trendValue="Today"
        onClick={() => setActiveTab('sales')}
      />

      {/* 7. Today's Collections */}
      <StatCard
        title="Today's Collections"
        value={formatCurrency(kpis.todayCollections)}
        subtitle="Counter + RTGS"
        icon={Banknote}
        accent="emerald"
        trend="up"
        trendValue="Collected"
        onClick={() => setActiveTab('payments')}
      />

      {/* 8. Total Pending Payments */}
      <StatCard
        title="Pending Bills"
        value={`${kpis.totalPendingPaymentsCount} Bills`}
        subtitle={`${formatCurrency(kpis.totalPendingPaymentsAmount)}`}
        icon={Clock}
        accent="rose"
        trend="down"
        trendValue="Follow-up"
        onClick={() => setActiveTab('sales')}
      />
    </div>
  );
};
