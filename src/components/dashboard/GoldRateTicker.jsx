import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Sparkles, Edit3, Clock, TrendingUp } from 'lucide-react';

export const GoldRateTicker = () => {
  const { rates, isRatesModalOpen, setIsRatesModalOpen, handleUpdateRates } = useApp();

  const [formRates, setFormRates] = useState({
    karat_24k: rates?.karat_24k || 7850,
    karat_22k: rates?.karat_22k || 7200,
    karat_18k: rates?.karat_18k || 5900,
    silver_rate: rates?.silver_rate || 92
  });

  const handleOpenModal = () => {
    if (rates) {
      setFormRates({
        karat_24k: rates.karat_24k,
        karat_22k: rates.karat_22k,
        karat_18k: rates.karat_18k,
        silver_rate: rates.silver_rate
      });
    }
    setIsRatesModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateRates({
      karat_24k: parseFloat(formRates.karat_24k),
      karat_22k: parseFloat(formRates.karat_22k),
      karat_18k: parseFloat(formRates.karat_18k),
      silver_rate: parseFloat(formRates.silver_rate)
    });
  };

  return (
    <>
      <div className="bg-white border border-[#F1F4F9] rounded-3xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(7,1,39,0.04)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-navy-950">
                    Live Bullion Board
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                    <Clock className="w-2.5 h-2.5 text-[#1E65FF]" />
                    {rates?.last_updated || 'Today'}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium">
                  Official 24K, 22K (916), 18K gold & silver rates per gram
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenModal}
              className="md:hidden inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-navy-950 rounded-full text-xs font-bold transition-colors"
            >
              <Edit3 className="w-3 h-3 text-[#1E65FF]" />
              Edit
            </button>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6 w-full md:w-auto justify-between md:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div className="bg-[#F8FAFC] sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border sm:border-0 border-slate-200/60 text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">24K Fine Gold</span>
              <span className="text-sm sm:text-base font-extrabold font-mono text-navy-950">
                ₹{Number(rates?.karat_24k || 7850).toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/g</span>
              </span>
            </div>

            <div className="bg-amber-50/60 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border sm:border-0 border-amber-200/50 text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">22K (916 Hallmark)</span>
              <span className="text-sm sm:text-base font-extrabold font-mono text-amber-800">
                ₹{Number(rates?.karat_22k || 7200).toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/g</span>
              </span>
            </div>

            <div className="bg-[#F8FAFC] sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border sm:border-0 border-slate-200/60 text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">18K Gold</span>
              <span className="text-sm sm:text-base font-extrabold font-mono text-navy-950">
                ₹{Number(rates?.karat_18k || 5900).toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/g</span>
              </span>
            </div>

            <div className="bg-[#F8FAFC] sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border sm:border-0 border-slate-200/60 text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Silver 999</span>
              <span className="text-sm sm:text-base font-extrabold font-mono text-slate-700">
                ₹{Number(rates?.silver_rate || 92).toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/g</span>
              </span>
            </div>

            <button
              onClick={handleOpenModal}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-navy-950 rounded-full text-xs font-bold transition-colors ml-2"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#1E65FF]" />
              Update Rates
            </button>
          </div>
        </div>
      </div>

      {/* Edit Rates Modal */}
      <Modal
        isOpen={isRatesModalOpen}
        onClose={() => setIsRatesModalOpen(false)}
        title="Update Bullion Market Rates"
        subtitle="These rates are used dynamically for billing hallmarked jewellery"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-navy-950 uppercase tracking-wider">
              Gold 24K (999 Purity) Rate (₹ / gram)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formRates.karat_24k}
              onChange={(e) => setFormRates({ ...formRates, karat_24k: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#FBFBFD] text-sm font-mono font-bold text-navy-950 focus:border-[#1E65FF] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Gold 22K (916 BIS Hallmark) Rate (₹ / gram)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formRates.karat_22k}
              onChange={(e) => setFormRates({ ...formRates, karat_22k: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-amber-300 bg-amber-50/30 text-sm font-mono font-bold text-amber-900 focus:border-[#1E65FF] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-navy-950 uppercase tracking-wider">
              Gold 18K (750 Purity) Rate (₹ / gram)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formRates.karat_18k}
              onChange={(e) => setFormRates({ ...formRates, karat_18k: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#FBFBFD] text-sm font-mono font-bold text-navy-950 focus:border-[#1E65FF] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Fine Silver Rate (₹ / gram)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formRates.silver_rate}
              onChange={(e) => setFormRates({ ...formRates, silver_rate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#FBFBFD] text-sm font-mono font-bold text-navy-950 focus:border-[#1E65FF] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRatesModalOpen(false)}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#1E65FF] hover:bg-[#1554E8] text-white text-xs font-bold shadow-[0_4px_14px_rgba(30,101,255,0.35)] transition-all"
            >
              Save Rates
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
