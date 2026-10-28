import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, AlertCircle } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLimit: number;
  totalSpent: number;
  onSaveLimit: (newLimit: number) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  currentLimit,
  totalSpent,
  onSaveLimit,
}) => {
  const [newLimitStr, setNewLimitStr] = useState(currentLimit.toString());

  if (!isOpen) return null;

  const numericLimit = parseFloat(newLimitStr) || 0;
  const isOver = totalSpent > numericLimit;
  const diff = Math.abs(totalSpent - numericLimit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericLimit > 0) {
      onSaveLimit(numericLimit);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#121927] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#151e30]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Monthly Budget Settings</h3>
              <p className="text-xs text-slate-400">Configure your spending allowance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Monthly Budget Limit (INR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-base">
                ₹
              </span>
              <input
                type="number"
                min="500"
                step="500"
                value={newLimitStr}
                onChange={(e) => setNewLimitStr(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono font-bold text-lg focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="10000"
                autoFocus
              />
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] text-slate-400 font-medium block mb-2">Quick Presets:</span>
            <div className="flex gap-2">
              {[5000, 10000, 15000, 20000, 25000].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setNewLimitStr(preset.toString())}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors ${
                    numericLimit === preset
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  ₹{(preset / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview impact */}
          <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
            isOver
              ? 'bg-red-500/10 border-red-500/20 text-red-300'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
          }`}>
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>
                {isOver ? 'Budget Overrun Predicted' : 'Within Budget Limit'}
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              With current spend of <span className="text-white font-mono">{formatINR(totalSpent)}</span>, you will be{' '}
              <span className={isOver ? 'text-red-400 font-mono font-bold' : 'text-emerald-400 font-mono font-bold'}>
                {isOver ? `+${formatINR(diff)} over` : `${formatINR(diff)} under`}
              </span>{' '}
              the target.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={numericLimit <= 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#5f259f] to-[#7b39c6] hover:from-[#6b2ab3] hover:to-[#8b42de] text-white shadow-md shadow-purple-900/40 transition-all active:scale-95 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Budget</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

