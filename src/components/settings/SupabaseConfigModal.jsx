import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { getSupabaseConfig, saveSupabaseConfig } from '../../services/supabaseClient';
import { resetToDemoData } from '../../services/dataService';
import { Database, CheckCircle2, RefreshCw, Copy, Shield } from 'lucide-react';

export const SupabaseConfigModal = () => {
  const { isSupabaseModalOpen, setIsSupabaseModalOpen, showToast, refreshData } = useApp();
  const currentConfig = getSupabaseConfig();

  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.key);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveSupabaseConfig(url, anonKey);
    showToast('Supabase settings saved! Reloading data...');
    setIsSupabaseModalOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all customers, sales, and payments to original jewellery store demo data?')) {
      resetToDemoData();
      showToast('Database reset to initial gold shop records!');
      setIsSupabaseModalOpen(false);
      refreshData();
    }
  };

  const handleCopySchemaPath = () => {
    navigator.clipboard.writeText('supabase/schema.sql');
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
    showToast('Path copied! Run supabase/schema.sql in your Supabase SQL Editor.');
  };

  return (
    <Modal
      isOpen={isSupabaseModalOpen}
      onClose={() => setIsSupabaseModalOpen(false)}
      title="Database & Supabase Connection"
      subtitle="Connect your PostgreSQL Supabase project or use local offline storage"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-xs text-slate-600">
        {/* Status Card */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          currentConfig.isValid
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-amber-50 border-amber-200'
        }`}>
          {currentConfig.isValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <Database className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              {currentConfig.isValid
                ? 'Connected to Live Supabase Backend'
                : 'Interactive Local Database (Ready for Testing)'}
            </h4>
            <p className="mt-1 leading-relaxed text-slate-600">
              {currentConfig.isValid
                ? `Active endpoint: ${currentConfig.url}`
                : 'The CRM is currently running with an integrated, high-speed reactive local database. All customer records, photos, sales, invoices, and payments persist in your browser.'}
            </p>
          </div>
        </div>

        {/* Supabase Configuration Form */}
        <form onSubmit={handleSave} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-700" />
            Supabase Project Credentials
          </h4>

          <div>
            <label className="block font-semibold text-slate-700 uppercase mb-1">
              Project URL (VITE_SUPABASE_URL)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project-id.supabase.co"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase mb-1">
              Anon Public API Key (VITE_SUPABASE_ANON_KEY)
            </label>
            <textarea
              rows={2}
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleCopySchemaPath}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 text-navy-950 hover:bg-slate-200 border border-slate-200 font-bold transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-[#1E65FF]" />
              {copiedSchema ? 'Copied supabase/schema.sql' : 'Copy SQL Schema Path'}
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 font-bold text-white bg-[#1E65FF] hover:bg-[#1554E8] rounded-full shadow-[0_4px_14px_rgba(30,101,255,0.35)] transition-all active:scale-[0.98]"
            >
              Save & Connect
            </button>
          </div>
        </form>

        {/* Database Management & Demo Data Reset */}
        <div className="bg-[#F8FAFC] p-4 sm:p-5 rounded-2xl border border-slate-200/70 flex items-center justify-between">
          <div>
            <h5 className="font-extrabold text-navy-950">Reset Sample Jewellery Data</h5>
            <p className="text-slate-500 mt-0.5">
              Restores initial 6 jewellery customers, sales invoices, gold rates, and payment receipts.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDemo}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300 font-bold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Data
          </button>
        </div>
      </div>
    </Modal>
  );
};
