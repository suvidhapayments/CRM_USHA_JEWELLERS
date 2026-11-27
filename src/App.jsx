import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { CustomerList } from './components/customers/CustomerList';
import { CustomerFormModal } from './components/customers/CustomerFormModal';
import { CustomerDetailsModal } from './components/customers/CustomerDetailsModal';
import { SalesList } from './components/sales/SalesList';
import { NewSaleModal } from './components/sales/NewSaleModal';
import { SaleDetailsModal } from './components/sales/SaleDetailsModal';
import { PaymentList } from './components/payments/PaymentList';
import { AddPaymentModal } from './components/payments/AddPaymentModal';
import { PaymentReceiptModal } from './components/payments/PaymentReceiptModal';
import { ReportsView } from './components/reports/ReportsView';
import { SupabaseConfigModal } from './components/settings/SupabaseConfigModal';
import { Toast } from './components/common/Toast';

const MainContent = () => {
  const { activeTab, loading } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
              <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
              <p className="text-sm font-semibold text-amber-700">Loading Usha Jewellers CRM...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardOverview />}
              {activeTab === 'customers' && <CustomerList />}
              {activeTab === 'sales' && <SalesList />}
              {activeTab === 'payments' && <PaymentList />}
              {activeTab === 'reports' && <ReportsView />}
            </>
          )}
        </main>

        {/* Global Modals */}
        <CustomerFormModal />
        <CustomerDetailsModal />
        <NewSaleModal />
        <SaleDetailsModal />
        <AddPaymentModal />
        <PaymentReceiptModal />
        <SupabaseConfigModal />

        {/* Floating Toast */}
        <Toast />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
