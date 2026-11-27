import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  initialCustomers,
  initialSales,
  initialPayments,
  initialGoldRates
} from './mockData';
import { generateNextId } from '../utils/formatters';

const STORAGE_KEYS = {
  CUSTOMERS: 'usha_crm_customers',
  SALES: 'usha_crm_sales',
  PAYMENTS: 'usha_crm_payments',
  RATES: 'usha_crm_gold_rates'
};

// Helper to get local data
const getLocalData = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
};

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
};

// Reset to factory mock data
export const resetToDemoData = () => {
  setLocalData(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  setLocalData(STORAGE_KEYS.SALES, initialSales);
  setLocalData(STORAGE_KEYS.PAYMENTS, initialPayments);
  setLocalData(STORAGE_KEYS.RATES, initialGoldRates);
  window.dispatchEvent(new Event('usha_data_updated'));
};

// ==========================================
// 1. CUSTOMER OPERATIONS
// ==========================================

export const getCustomers = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local store:', e);
    }
  }
  return getLocalData(STORAGE_KEYS.CUSTOMERS, initialCustomers);
};

export const addCustomer = async (customerData) => {
  const existing = await getCustomers();
  const newCode = customerData.customer_code || generateNextId('CUST', existing, 'customer_code');
  
  const newCustomer = {
    ...customerData,
    id: `cust-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    customer_code: newCode,
    total_purchased: Number(customerData.total_purchased || 0),
    total_paid: Number(customerData.total_paid || 0),
    outstanding_balance: Number(customerData.outstanding_balance || 0),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([newCustomer])
        .select()
        .single();
      if (!error && data) {
        window.dispatchEvent(new Event('usha_data_updated'));
        return data;
      }
    } catch (e) {
      console.warn('Supabase insert failed, storing locally:', e);
    }
  }

  const updatedList = [newCustomer, ...existing];
  setLocalData(STORAGE_KEYS.CUSTOMERS, updatedList);
  window.dispatchEvent(new Event('usha_data_updated'));
  return newCustomer;
};

export const updateCustomer = async (id, updates) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        window.dispatchEvent(new Event('usha_data_updated'));
        return data;
      }
    } catch (e) {
      console.warn('Supabase update failed, updating locally:', e);
    }
  }

  const existing = await getCustomers();
  const index = existing.findIndex(c => c.id === id);
  if (index !== -1) {
    existing[index] = {
      ...existing[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    setLocalData(STORAGE_KEYS.CUSTOMERS, existing);
    window.dispatchEvent(new Event('usha_data_updated'));
    return existing[index];
  }
  return null;
};

export const deleteCustomer = async (id) => {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('customers').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }

  const existing = await getCustomers();
  const filtered = existing.filter(c => c.id !== id);
  setLocalData(STORAGE_KEYS.CUSTOMERS, filtered);
  window.dispatchEvent(new Event('usha_data_updated'));
  return true;
};

// ==========================================
// 2. SALES & INVOICE OPERATIONS
// ==========================================

export const getSales = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*, customers(*), sale_items(*)')
        .order('sale_date', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase sales fetch failed:', e);
    }
  }
  return getLocalData(STORAGE_KEYS.SALES, initialSales);
};

export const addSale = async (saleData) => {
  const existingSales = await getSales();
  const invoiceNumber = saleData.invoice_number || generateNextId('INV', existingSales, 'invoice_number');

  const newSale = {
    ...saleData,
    id: `sale-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    invoice_number: invoiceNumber,
    created_at: new Date().toISOString()
  };

  // Recalculate customer financials
  const customers = await getCustomers();
  const customerIndex = customers.findIndex(c => c.id === saleData.customer_id);
  if (customerIndex !== -1) {
    const cust = customers[customerIndex];
    cust.total_purchased = Number(cust.total_purchased || 0) + Number(newSale.final_amount);
    cust.total_paid = Number(cust.total_paid || 0) + Number(newSale.paid_amount);
    cust.outstanding_balance = Math.max(0, cust.total_purchased - cust.total_paid);
    setLocalData(STORAGE_KEYS.CUSTOMERS, customers);
  }

  // If initial payment was made with the sale, record payment entry too
  if (Number(newSale.paid_amount) > 0) {
    await addPayment({
      customer_id: newSale.customer_id,
      customer_name: newSale.customer_name,
      sale_id: newSale.id,
      invoice_number: newSale.invoice_number,
      amount: newSale.paid_amount,
      payment_date: newSale.sale_date || new Date().toISOString().split('T')[0],
      payment_mode: saleData.initial_payment_mode || 'upi',
      transaction_ref: saleData.initial_payment_ref || 'DOWN-PAYMENT',
      notes: `Advance/Down payment for Invoice ${invoiceNumber}`
    }, false); // prevent double customer balance addition
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('sales').insert([newSale]);
    } catch (e) {
      console.warn('Supabase insert sale error:', e);
    }
  }

  const updatedSales = [newSale, ...existingSales];
  setLocalData(STORAGE_KEYS.SALES, updatedSales);
  window.dispatchEvent(new Event('usha_data_updated'));
  return newSale;
};

// ==========================================
// 3. PAYMENTS & INSTALLMENTS
// ==========================================

export const getPayments = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('payment_date', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase payments fetch failed:', e);
    }
  }
  return getLocalData(STORAGE_KEYS.PAYMENTS, initialPayments);
};

export const addPayment = async (paymentData, updateCustomerBalance = true) => {
  const existingPayments = await getPayments();
  const receiptNumber = paymentData.receipt_number || generateNextId('RCP', existingPayments, 'receipt_number');

  const newPayment = {
    ...paymentData,
    id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    receipt_number: receiptNumber,
    amount: Number(paymentData.amount),
    created_at: new Date().toISOString()
  };

  if (updateCustomerBalance) {
    // 1. Update customer total_paid and outstanding_balance
    const customers = await getCustomers();
    const custIndex = customers.findIndex(c => c.id === paymentData.customer_id);
    if (custIndex !== -1) {
      const cust = customers[custIndex];
      cust.total_paid = Number(cust.total_paid || 0) + Number(paymentData.amount);
      cust.outstanding_balance = Math.max(0, Number(cust.total_purchased || 0) - cust.total_paid);
      setLocalData(STORAGE_KEYS.CUSTOMERS, customers);
    }

    // 2. Update linked sale if provided
    if (paymentData.sale_id) {
      const sales = await getSales();
      const saleIndex = sales.findIndex(s => s.id === paymentData.sale_id);
      if (saleIndex !== -1) {
        const sale = sales[saleIndex];
        const newPaid = Number(sale.paid_amount || 0) + Number(paymentData.amount);
        const newBalance = Math.max(0, Number(sale.final_amount) - newPaid);
        sale.paid_amount = newPaid;
        sale.balance_amount = newBalance;
        sale.payment_status = newBalance <= 0 ? 'paid' : 'partial';
        setLocalData(STORAGE_KEYS.SALES, sales);
      }
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('payments').insert([newPayment]);
    } catch (e) {
      console.warn('Supabase insert payment error:', e);
    }
  }

  const updatedPayments = [newPayment, ...existingPayments];
  setLocalData(STORAGE_KEYS.PAYMENTS, updatedPayments);
  window.dispatchEvent(new Event('usha_data_updated'));
  return newPayment;
};

// ==========================================
// 4. GOLD RATES OPERATIONS
// ==========================================

export const getGoldRates = async () => {
  return getLocalData(STORAGE_KEYS.RATES, initialGoldRates);
};

export const updateGoldRates = async (rates) => {
  const updated = {
    ...rates,
    last_updated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  setLocalData(STORAGE_KEYS.RATES, updated);
  window.dispatchEvent(new Event('usha_data_updated'));
  return updated;
};

// ==========================================
// 5. STORAGE & PHOTO UPLOADS
// ==========================================

export const uploadCustomerPhoto = async (file, customerId) => {
  // If Supabase Storage is configured and online, upload to 'customer-photos'
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${customerId || 'cust'}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { data, error } = await supabase.storage
        .from('customer-photos')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (!error && data) {
        const { data: publicData } = supabase.storage
          .from('customer-photos')
          .getPublicUrl(filePath);
        return publicData.publicUrl;
      }
    } catch (err) {
      console.warn('Supabase storage upload failed, using Data URL fallback:', err);
    }
  }

  // Robust client-side fallback: Convert to Data URL (base64)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

// ==========================================
// 6. DASHBOARD KPIS & ANALYTICS COMPUTATION
// ==========================================

export const calculateDashboardMetrics = async () => {
  const [customers, sales, payments, rates] = await Promise.all([
    getCustomers(),
    getSales(),
    getPayments(),
    getGoldRates()
  ]);

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Total Customers
  const totalCustomers = customers.length;

  // 2. Total Gold Sold (in grams)
  const totalGoldSoldGrams = sales.reduce((acc, sale) => {
    return acc + Number(sale.total_net_weight || sale.total_gross_weight || 0);
  }, 0);

  // 3. Total Sales Amount (₹)
  const totalSalesAmount = sales.reduce((acc, sale) => {
    return acc + Number(sale.final_amount || 0);
  }, 0);

  // 4. Total Amount Received (₹)
  const totalAmountReceived = payments.reduce((acc, p) => {
    return acc + Number(p.amount || 0);
  }, 0);

  // 5. Total Outstanding Amount (₹)
  const totalOutstandingAmount = Math.max(0, totalSalesAmount - totalAmountReceived);

  // 6. Today's Sales
  const todaySales = sales
    .filter(s => s.sale_date === todayStr || (s.created_at && s.created_at.startsWith(todayStr)))
    .reduce((acc, sale) => acc + Number(sale.final_amount || 0), 0);

  // 7. Today's Collections
  const todayCollections = payments
    .filter(p => p.payment_date === todayStr || (p.created_at && p.created_at.startsWith(todayStr)))
    .reduce((acc, p) => acc + Number(p.amount || 0), 0);

  // 8. Total Pending Payments (count & amount)
  const pendingSales = sales.filter(s => s.payment_status !== 'paid' && Number(s.balance_amount) > 0);
  const totalPendingPaymentsCount = pendingSales.length;
  const totalPendingPaymentsAmount = pendingSales.reduce((acc, s) => acc + Number(s.balance_amount || 0), 0);

  // Monthly Sales & Collections Chart Data (last 6 months)
  const monthlyDataMap = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Seed recent 6 months
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear() % 100}`;
    monthlyDataMap[key] = {
      month: key,
      sales: 0,
      collections: 0,
      goldGrams: 0
    };
  }

  // Populate from sales
  sales.forEach(s => {
    const d = new Date(s.sale_date || s.created_at);
    if (!isNaN(d.getTime())) {
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear() % 100}`;
      if (monthlyDataMap[key]) {
        monthlyDataMap[key].sales += Number(s.final_amount || 0);
        monthlyDataMap[key].goldGrams += Number(s.total_net_weight || 0);
      }
    }
  });

  // Populate from payments
  payments.forEach(p => {
    const d = new Date(p.payment_date || p.created_at);
    if (!isNaN(d.getTime())) {
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear() % 100}`;
      if (monthlyDataMap[key]) {
        monthlyDataMap[key].collections += Number(p.amount || 0);
      }
    }
  });

  const monthlyOverview = Object.values(monthlyDataMap);

  // Paid vs Outstanding Donut
  const paidVsOutstanding = [
    { name: 'Amount Received', value: totalAmountReceived, color: '#10b981' }, // emerald-500
    { name: 'Outstanding Balance', value: totalOutstandingAmount, color: '#f59e0b' } // amber-500
  ];

  // Recent sales (top 5)
  const recentSales = [...sales]
    .sort((a, b) => new Date(b.created_at || b.sale_date) - new Date(a.created_at || a.sale_date))
    .slice(0, 5);

  // Recent payments (top 5)
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.created_at || b.payment_date) - new Date(a.created_at || a.payment_date))
    .slice(0, 5);

  return {
    kpis: {
      totalCustomers,
      totalGoldSoldGrams,
      totalSalesAmount,
      totalAmountReceived,
      totalOutstandingAmount,
      todaySales,
      todayCollections,
      totalPendingPaymentsCount,
      totalPendingPaymentsAmount
    },
    charts: {
      monthlyOverview,
      paidVsOutstanding,
    },
    recentSales,
    recentPayments,
    rates
  };
};
