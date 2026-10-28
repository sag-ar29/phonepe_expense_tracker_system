import React from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SkippedLine } from '../../types';

interface HealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  validCount: number;
  skippedLines: SkippedLine[];
}

export const HealthModal: React.FC<HealthModalProps> = ({
  isOpen,
  onClose,
  validCount,
  skippedLines,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#121927] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#151e30]">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              skippedLines.length > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              {skippedLines.length > 0 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Statement Health Diagnostics</h2>
              <p className="text-xs text-slate-400">
                Detailed parsing validation & syntax report
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Summary Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-300">Valid Transactions</span>
              <span className="text-lg font-bold text-emerald-400">{validCount}</span>
            </div>
            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
              skippedLines.length > 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-slate-800/40 border-white/5 text-slate-400'
            }`}>
              <span className="text-xs font-medium">Skipped Malformed Lines</span>
              <span className="text-lg font-bold">{skippedLines.length}</span>
            </div>
          </div>

          {/* Skipped lines list */}
          {skippedLines.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Skipped Lines Details
              </h4>
              <div className="space-y-2.5">
                {skippedLines.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0b0f17] border border-amber-500/20 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        Line #{item.line_number}
                      </span>
                      <span className="text-xs text-red-400 font-medium">
                        {item.reason}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-black/50 border border-white/5 font-mono text-xs text-slate-300 break-all">
                      {item.raw_text}
                    </div>

                    <p className="text-[11px] text-slate-400">
                      💡 Ensure the line matches format: <code className="text-purple-300 font-mono">YYYY-MM-DD, Merchant, Amount</code>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-semibold text-white">Clean Statement</h4>
              <p className="text-xs text-slate-400">
                All lines in your statement passed validation without any syntax errors!
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/5 bg-[#151e30] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
