-- ==============================================================================
-- USHA JEWELLERS CRM - COMPLETE SUPABASE POSTGRESQL SCHEMA
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Gold Daily Rates Table
CREATE TABLE IF NOT EXISTS public.gold_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    karat_24k NUMERIC(10, 2) NOT NULL DEFAULT 7850.00,
    karat_22k NUMERIC(10, 2) NOT NULL DEFAULT 7200.00,
    karat_18k NUMERIC(10, 2) NOT NULL DEFAULT 5900.00,
    silver_rate NUMERIC(10, 2) NOT NULL DEFAULT 92.00,
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    alternate_mobile VARCHAR(20),
    address TEXT NOT NULL,
    aadhaar_number VARCHAR(20),
    photo_url TEXT,
    notes TEXT,
    total_purchased NUMERIC(12, 2) DEFAULT 0.00,
    total_paid NUMERIC(12, 2) DEFAULT 0.00,
    outstanding_balance NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_mobile ON public.customers(mobile);
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_code ON public.customers(customer_code);

-- 4. Sales Table (Invoices)
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_gross_weight NUMERIC(10, 3) NOT NULL DEFAULT 0.000,
    total_net_weight NUMERIC(10, 3) NOT NULL DEFAULT 0.000,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    making_charges NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    wastage_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    gst_percent NUMERIC(5, 2) NOT NULL DEFAULT 3.00, -- 3% GST on gold in India
    gst_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    final_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    balance_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'partial', 'pending')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_customer ON public.sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON public.sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_status ON public.sales(payment_status);

-- 5. Sale Items Table
CREATE TABLE IF NOT EXISTS public.sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Necklace', -- Necklace, Ring, Bangle, Chain, Earring, Coin, Other
    karat VARCHAR(10) NOT NULL DEFAULT '22K', -- 24K, 22K, 18K
    gross_weight NUMERIC(10, 3) NOT NULL DEFAULT 0.000,
    stone_weight NUMERIC(10, 3) NOT NULL DEFAULT 0.000,
    net_weight NUMERIC(10, 3) NOT NULL DEFAULT 0.000,
    gold_rate_per_gram NUMERIC(10, 2) NOT NULL,
    making_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    wastage_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    item_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    huid_code VARCHAR(50), -- Hallmarking Unique ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON public.sale_items(sale_id);

-- 6. Payments / Installments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_mode VARCHAR(30) NOT NULL DEFAULT 'cash' CHECK (payment_mode IN ('cash', 'upi', 'card', 'bank_transfer', 'cheque')),
    transaction_ref VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_customer ON public.payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_sale ON public.payments(sale_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON public.payments(payment_date);

-- 7. Customer Documents
CREATE TABLE IF NOT EXISTS public.customer_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL DEFAULT 'aadhaar', -- aadhaar, pan, passport, invoice, other
    document_name VARCHAR(255) NOT NULL,
    document_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_docs_cust ON public.customer_documents(customer_id);

-- 8. Functions & Triggers to auto-calculate customer balances
CREATE OR REPLACE FUNCTION update_customer_financials()
RETURNS TRIGGER AS $$
DECLARE
    target_cust_id UUID;
    total_sales NUMERIC(12, 2) := 0;
    total_payments NUMERIC(12, 2) := 0;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_cust_id := OLD.customer_id;
    ELSE
        target_cust_id := NEW.customer_id;
    END IF;

    -- Calculate total sales for this customer
    SELECT COALESCE(SUM(final_amount), 0) INTO total_sales
    FROM public.sales WHERE customer_id = target_cust_id;

    -- Calculate total payments for this customer
    SELECT COALESCE(SUM(amount), 0) INTO total_payments
    FROM public.payments WHERE customer_id = target_cust_id;

    -- Update customer master
    UPDATE public.customers
    SET 
        total_purchased = total_sales,
        total_paid = total_payments,
        outstanding_balance = (total_sales - total_payments),
        updated_at = NOW()
    WHERE id = target_cust_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger on sales
DROP TRIGGER IF EXISTS trg_update_customer_sales ON public.sales;
CREATE TRIGGER trg_update_customer_sales
AFTER INSERT OR UPDATE OR DELETE ON public.sales
FOR EACH ROW EXECUTE FUNCTION update_customer_financials();

-- Trigger on payments
DROP TRIGGER IF EXISTS trg_update_customer_payments ON public.payments;
CREATE TRIGGER trg_update_customer_payments
AFTER INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW EXECUTE FUNCTION update_customer_financials();

-- 9. Storage Buckets (Run in Supabase Storage or Dashboard)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('customer-photos', 'customer-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('customer-documents', 'customer-documents', true)
ON CONFLICT (id) DO NOTHING;

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gold_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_documents ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated read/write on customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on sales" ON public.sales FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on sale_items" ON public.sale_items FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on payments" ON public.payments FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on gold_rates" ON public.gold_rates FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on customer_documents" ON public.customer_documents FOR ALL USING (true);

-- Allow public read of gold rates for display
CREATE POLICY "Allow anon read gold_rates" ON public.gold_rates FOR SELECT USING (true);
