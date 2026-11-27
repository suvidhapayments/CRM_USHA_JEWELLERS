import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getSales,
  addSale,
  getPayments,
  addPayment,
  getGoldRates,
  updateGoldRates,
  calculateDashboardMetrics,
  uploadCustomerPhoto
} from '../services/dataService';
import { isSupabaseConfigured } from '../services/supabaseClient';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Core records
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [payments, setPayments] = useState([]);
  const [rates, setRates] = useState(null);
  const [metrics, setMetrics] = useState(null);

  // Global search & filters
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [selectedSaleCustomer, setSelectedSaleCustomer] = useState(null);
  const [activeSaleDetails, setActiveSaleDetails] = useState(null);

  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [paymentPreselect, setPaymentPreselect] = useState({ customer: null, sale: null });
  const [activeReceipt, setActiveReceipt] = useState(null);

  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  // Fetch all CRM state
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [custs, sls, pymts, rts, mtrcs] = await Promise.all([
        getCustomers(),
        getSales(),
        getPayments(),
        getGoldRates(),
        calculateDashboardMetrics()
      ]);

      setCustomers(custs);
      setSales(sls);
      setPayments(pymts);
      setRates(rts);
      setMetrics(mtrcs);

      // Keep selected customer in sync if open
      if (selectedCustomer) {
        const found = custs.find((c) => c.id === selectedCustomer.id);
        if (found) setSelectedCustomer(found);
      }
    } catch (err) {
      console.error('Failed to load CRM data:', err);
      showToast('Error loading CRM records', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedCustomer, showToast]);

  useEffect(() => {
    loadData();

    // Listen to local data updates
    const handleUpdate = () => loadData();
    window.addEventListener('usha_data_updated', handleUpdate);
    return () => window.removeEventListener('usha_data_updated', handleUpdate);
  }, []);

  // Customer Actions
  const handleAddCustomer = async (data) => {
    try {
      const created = await addCustomer(data);
      showToast(`Customer ${created.name} (${created.customer_code}) created successfully!`);
      setIsNewCustomerOpen(false);
      await loadData();
      return created;
    } catch (err) {
      showToast('Failed to create customer', 'error');
      throw err;
    }
  };

  const handleUpdateCustomer = async (id, data) => {
    try {
      const updated = await updateCustomer(id, data);
      showToast(`Customer ${updated.name} updated!`);
      setEditingCustomer(null);
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(updated);
      }
      await loadData();
      return updated;
    } catch (err) {
      showToast('Failed to update customer', 'error');
      throw err;
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomer(id);
      showToast('Customer deleted');
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
      await loadData();
    } catch (err) {
      showToast('Failed to delete customer', 'error');
    }
  };

  // Sale Actions
  const handleAddSale = async (saleData) => {
    try {
      const created = await addSale(saleData);
      showToast(`Sale Invoice ${created.invoice_number} generated successfully!`);
      setIsNewSaleOpen(false);
      setSelectedSaleCustomer(null);
      await loadData();

      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      return created;
    } catch (err) {
      showToast('Failed to save sale invoice', 'error');
      throw err;
    }
  };

  // Payment Actions
  const handleAddPayment = async (paymentData) => {
    try {
      const created = await addPayment(paymentData);
      showToast(`Payment receipt ${created.receipt_number} of ₹${Number(created.amount).toLocaleString('en-IN')} recorded!`);
      setIsAddPaymentOpen(false);
      setPaymentPreselect({ customer: null, sale: null });
      await loadData();

      // If full balance was cleared, small confetti
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.7 }
      });

      // Show receipt modal
      setActiveReceipt(created);
      return created;
    } catch (err) {
      showToast('Failed to record payment', 'error');
      throw err;
    }
  };

  // Rates Action
  const handleUpdateRates = async (ratesData) => {
    try {
      const updated = await updateGoldRates(ratesData);
      setRates(updated);
      showToast('Today’s Gold & Silver rates updated!');
      setIsRatesModalOpen(false);
      await loadData();
    } catch (err) {
      showToast('Failed to update rates', 'error');
    }
  };

  // Photo Upload
  const handleUploadPhoto = async (file, customerId) => {
    try {
      const url = await uploadCustomerPhoto(file, customerId);
      if (customerId) {
        await updateCustomer(customerId, { photo_url: url });
      }
      showToast('Customer photo uploaded successfully');
      return url;
    } catch (err) {
      showToast('Failed to upload photo', 'error');
      throw err;
    }
  };

  // Shortcut helpers
  const openNewSaleForCustomer = (customer) => {
    setSelectedSaleCustomer(customer);
    setIsNewSaleOpen(true);
  };

  const openAddPaymentForCustomer = (customer, sale = null) => {
    setPaymentPreselect({ customer, sale });
    setIsAddPaymentOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        loading,
        customers,
        sales,
        payments,
        rates,
        metrics,
        searchQuery,
        setSearchQuery,
        isSupabaseConfigured,

        // Modal triggers
        isNewCustomerOpen,
        setIsNewCustomerOpen,
        editingCustomer,
        setEditingCustomer,
        selectedCustomer,
        setSelectedCustomer,

        isNewSaleOpen,
        setIsNewSaleOpen,
        selectedSaleCustomer,
        setSelectedSaleCustomer,
        activeSaleDetails,
        setActiveSaleDetails,

        isAddPaymentOpen,
        setIsAddPaymentOpen,
        paymentPreselect,
        setPaymentPreselect,
        activeReceipt,
        setActiveReceipt,

        isRatesModalOpen,
        setIsRatesModalOpen,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,

        // Actions
        handleAddCustomer,
        handleUpdateCustomer,
        handleDeleteCustomer,
        handleAddSale,
        handleAddPayment,
        handleUpdateRates,
        handleUploadPhoto,
        openNewSaleForCustomer,
        openAddPaymentForCustomer,
        refreshData: loadData,

        // Toast
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
