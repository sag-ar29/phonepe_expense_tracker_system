import React from 'react';
import { AlertTriangle, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface BudgetBannerProps {
  totalSpent: number;
  budgetLimit: number;
  isOverBudget: boolean;
  overrunAmount: number;
  onOpenBudgetModal: () => void;
}

export const BudgetBanner: React.FC<BudgetBannerProps> = ({
  totalSpent,
  budgetLimit,
  isOverBudget,
  overrunAmount,
  onOpenBudgetModal,
}) => {
  const percentage = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;
  const remaining = Math.max(0, budgetLimit - totalSpent);

  if (isOverBudget) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-red-900/20 to-red-950/40 p-4 sm:p-5 shadow-lg shadow-red-950/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/30 text-red-300">
                  Budget Overrun Alert
                </span>
                <span className="text-xs text-red-300 font-mono font-semibold">
                  {percentage.toFixed(1)}% of limit
                </span>
              </div>
              <p className="text-sm font-semibold text-white mt-1">
                You have exceeded your monthly budget of{' '}
                <span className="text-red-300 font-mono">{formatINR(budgetLimit)}</span> by{' '}
                <span className="text-red-400 font-bold font-mono text-base">{formatINR(overrunAmount)}</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Total expenditure is currently at {formatINR(totalSpent)}. Consider curtailing discretionary spending.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBudgetModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 transition-all shrink-0 active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Adjust Budget</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3.5 w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-rose-400 transition-all duration-500"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-emerald-950/20 p-4 sm:p-5 shadow-lg shadow-emerald-950/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Within Budget
              </span>
              <span className="text-xs text-emerald-300 font-mono font-semibold">
                {percentage.toFixed(1)}% consumed
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-1">
              You are within your monthly budget of{' '}
              <span className="text-slate-300 font-mono">{formatINR(budgetLimit)}</span>!
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              You have <span className="text-emerald-400 font-mono font-bold">{formatINR(remaining)}</span> remaining for the rest of the cycle.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBudgetModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all shrink-0 active:scale-95"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Adjust Budget</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3.5 w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
};
