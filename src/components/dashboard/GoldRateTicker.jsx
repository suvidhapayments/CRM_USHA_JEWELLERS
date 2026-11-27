import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Sparkles, Edit3, Clock } from 'lucide-react';

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
      <div className="bg-gradient-to-r from-amber-50/90 via-white to-amber-50/90 border border-amber-200/90 rounded-2xl p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-300">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Today's Live Bullion Board
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-medium">
                  <Clock className="w-3 h-3 text-amber-600" />
                  Updated {rates?.last_updated || 'Today'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Market benchmark for hallmarked gold jewellery & coin sales
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap w-full md:w-auto justify-between md:justify-end">
            <div className="text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">24K Gold (999)</span>
              <span className="text-base font-bold font-mono text-amber-800">
                ₹{Number(rates?.karat_24k || 7850).toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/g</span>
              </span>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">22K Gold (916)</span>
              <span className="text-base font-bold font-mono text-slate-900">
                ₹{Number(rates?.karat_22k || 7200).toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/g</span>
              </span>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">18K Gold (750)</span>
              <span className="text-base font-bold font-mono text-slate-800">
                ₹{Number(rates?.karat_18k || 5900).toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/g</span>
              </span>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Fine Silver</span>
              <span className="text-base font-bold font-mono text-slate-800">
                ₹{Number(rates?.silver_rate || 92).toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/g</span>
              </span>
            </div>

            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-amber-800 rounded-xl text-xs font-semibold border border-amber-300 transition-colors shadow-2xs ml-auto md:ml-0"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
              Change Rates
            </button>
          </div>
        </div>
      </div>

      {/* Edit Rates Modal */}
      <Modal
        isOpen={isRatesModalOpen}
        onClose={() => setIsRatesModalOpen(false)}
        title="Update Today's Gold & Silver Rates"
        subtitle="This adjusts the automatic gram calculation for all new jewellery sales"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              24K Pure Gold Rate (₹ / Gram)
            </label>
            <input
              type="number"
              step="any"
              value={formRates.karat_24k}
              onChange={(e) => setFormRates({ ...formRates, karat_24k: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              22K Standard 916 Gold Rate (₹ / Gram)
            </label>
            <input
              type="number"
              step="any"
              value={formRates.karat_22k}
              onChange={(e) => setFormRates({ ...formRates, karat_22k: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              18K Diamond Gold Rate (₹ / Gram)
            </label>
            <input
              type="number"
              step="any"
              value={formRates.karat_18k}
              onChange={(e) => setFormRates({ ...formRates, karat_18k: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Silver Rate (₹ / Gram)
            </label>
            <input
              type="number"
              step="any"
              value={formRates.silver_rate}
              onChange={(e) => setFormRates({ ...formRates, silver_rate: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRatesModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors"
            >
              Save New Board Rates
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
