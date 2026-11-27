# Usha Jewellers – Gold Shop Customer & Sales Management CRM

A modern, secure, and responsive web-based **Gold Shop Customer & Sales Management CRM** crafted for jewellery shops to manage customer profiles, hallmarked gold sales, installment payments, outstanding balances, KYC documents, and sales reports.

---

## 🚀 Key Features

### 1. 📊 Executive Dashboard
- **8 Dynamic KPI Cards**:
  - **Total Customers**: Count of registered jewellery buyers.
  - **Total Gold Sold (g)**: Cumulative pure gold weight sold (in grams).
  - **Total Sales Amount (₹)**: Lifetime billed revenue.
  - **Total Amount Received (₹)**: Cleared collections via UPI, Cash, Cards, and Bank Transfer.
  - **Total Outstanding Amount (₹)**: Current pending customer credit/installments.
  - **Today's Sales (₹)**: Gross sales generated today.
  - **Today's Collections (₹)**: Total payments collected today.
  - **Pending Invoices**: Count and amount of uncollected customer bills.
- **Interactive Visual Analytics (Recharts)**:
  - **Monthly Sales Overview & Collections Performance** (Area Chart with dual gradients).
  - **Monthly Pure Gold Weight Volume** (Bar Chart in grams).
  - **Paid vs Outstanding Ratio** (Interactive Donut Chart with center recovery percentage).
- **Recent Activities**:
  - Live table of latest sales bills with status badges.
  - Live table of latest payment installment receipts.
- **Live Bullion Rate Board**:
  - Real-time 24K, 22K, 18K gold and silver rates with 1-click modal editor.

---

### 2. 👤 Customer Management Module
- **Comprehensive Customer Profile**:
  - Customer ID (Unique auto-incrementing ID: e.g., `CUST-2026-001`).
  - Customer Full Name.
  - Customer Mobile Number & Optional Alternate Mobile.
  - Customer Address (KYC verified).
  - Customer Photo (File upload, drag-and-drop, sample avatar chooser).
  - Aadhaar Number (12 digits with masked privacy toggle `XXXX-XXXX-1234`).
  - Created Date & Registration timestamp.
  - Notes & Jewellery Preferences (e.g. "Prefers 22K antique gold", "VIP client").
- **Operations & Features**:
  - Add new customer with KYC validation.
  - Edit customer profile and change photo.
  - Detailed Customer Profile view showing complete purchase history, payment installments, and real-time ledger balance.
  - Real-time search across Name, Phone, Customer ID, Aadhaar, and Address.
  - Filter by "All", "With Outstanding Balance", and "Zero Balance".
  - 1-Click WhatsApp reminder and Direct Phone Call integration.
  - Export customers list to CSV.

---

### 3. 💍 Gold Sales & Tax Invoices
- **Jewellery Sales Invoice Creation**:
  - Dynamic multi-item entry (Necklace, Bangles, Rings, Chains, Earrings, Mangalsutra, Coins/Bars).
  - Karat selection (24K, 22K, 18K) auto-populating today's daily board rates.
  - Gross Weight, Stone Weight, and Pure Net Gold Weight calculation.
  - Making charges (fixed or per-gram) and wastage percentage.
  - Hallmarking Unique ID (HUID) code tracking.
  - Automatic calculation of Subtotal, GST (3.0% on gold), and Discount.
  - Flexible payment modes: Full Payment, Installments / Down Payment, or Full Credit.
- **Printable Tax Invoices**:
  - Authentic jewellery store bill layout with shop name, GSTIN, BIS Hallmark badge, itemized breakdown, and signature blocks.
  - Browser print-ready (`window.print()`) with print stylesheets.

---

### 4. 💳 Installments & Payment Collections
- **Installment Recording**:
  - Auto-generated receipt number (e.g., `RCP-2026-001`).
  - Link payment to specific invoice or general customer account credit.
  - Payment modes: UPI (GPay/PhonePe), Cash, Cards, Bank Transfer (NEFT/RTGS), Cheque.
  - Automatically updates customer ledger balance and invoice status (`paid`, `partial`, `pending`).
- **Printable Payment Receipts**:
  - Official receipt slip with receipt number, customer details, amount in words, payment mode, and remaining balance.

---

### 5. 📈 Audit Reports & Aging Analysis
- Date range filters (Today, This Month, All Time).
- Customer installment aging ledger with debtor list.
- Pre-filled WhatsApp payment reminder link.
- Jewellery category volume breakdown.
- Export debtor reports to CSV.

---

## 🛠 Technology Stack

- **Frontend:** React 18 with Vite
- **UI & Styling:** Tailwind CSS (Custom luxury gold palette `slate-950` & `amber-500`)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Database & Auth:** Supabase (PostgreSQL) + LocalStorage Reactive Fallback Store
- **File & Storage:** Supabase Storage (`customer-photos`, `customer-documents`) + Data URL client fallback

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🗄 Supabase Setup (Optional Live Connection)

The CRM comes pre-configured with an **Interactive Local Database** with realistic sample jewellery data, so you can test every single feature immediately without any external setup.

To connect your live Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run the script in:
   ```
   supabase/schema.sql
   ```
3. Copy your **Project URL** and **Anon Public Key** from Supabase Settings -> API.
4. Add them to `.env` or paste them directly into the CRM UI via the **Database Status button** in the top navigation bar!
