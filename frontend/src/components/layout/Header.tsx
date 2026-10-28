import React, { useState } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  SlidersHorizontal, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { ExpenseSummary } from '../../types';

interface HeaderProps {
  summary: ExpenseSummary | null;
  isLoading: boolean;
  onSelectFile: () => void;
  onLoadDemo: () => void;
  onOpenBudgetModal: () => void;
  onOpenHealthModal: () => void;
  onExport: (format: 'csv' | 'json') => void;
}

export const Header: React.FC<HeaderProps> = ({
  summary,
  isLoading,
  onSelectFile,
  onLoadDemo,
  onOpenBudgetModal,
  onOpenHealthModal,
  onExport,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="px-6 py-4 border-b border-white/5 bg-[#0d131f]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5f259f] to-[#8a3ffc] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-900/40 border border-purple-400/20">
          पे
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">
              PhonePe <span className="text-purple-400">Expense Intelligence</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Statement Analyzer & Budget Velocity Tracker
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Health status indicator */}
        {summary && (
          <button
            onClick={onOpenHealthModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              summary.skipped_count > 0
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
            title="Inspect statement parsing health"
          >
            {summary.skipped_count > 0 ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{summary.skipped_count} Skipped</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>All {summary.transaction_count} Valid</span>
              </>
            )}
          </button>
        )}

        {/* 1-Click Demo statement loader */}
        <button
          onClick={onLoadDemo}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-purple-400/30 transition-all active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Try Demo</span>
        </button>

        {/* Select File via Native Explorer */}
        <button
          onClick={onSelectFile}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#5f259f] to-[#7b39c6] hover:from-[#6b2ab3] hover:to-[#8b42de] text-white shadow-md shadow-purple-950/40 border border-purple-400/30 transition-all active:scale-95 disabled:opacity-50"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Open Statement</span>
        </button>

        {/* Budget limit settings modal */}
        <button
          onClick={onOpenBudgetModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition-colors"
          title="Adjust Monthly Budget Limit"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Budget</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={!summary || summary.transaction_count === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#141b2d] border border-white/10 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  onExport('csv');
                  setShowExportMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-purple-500/20 hover:text-white transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Export Ledger (CSV)</span>
              </button>
              <button
                onClick={() => {
                  onExport('json');
                  setShowExportMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-purple-500/20 hover:text-white transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Export Summary (JSON)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

