import React from 'react';
import { ShieldCheck, Minus, Square, X } from 'lucide-react';

export const Titlebar: React.FC = () => {
  return (
    <div className="h-9 w-full bg-[#080c13] border-b border-white/5 flex items-center justify-between px-3 select-none text-xs text-slate-400">
      {/* Brand & App Info */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-[#5f259f] flex items-center justify-center text-[10px] text-white font-black shadow-sm shadow-purple-500/50">
          पे
        </div>
        <span className="font-semibold text-slate-300 tracking-wide">
          PhonePe Expense Intelligence
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
          v1.0 Desktop
        </span>
      </div>

      {/* Center status */}
      <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>100% Offline & Private Statement Engine</span>
      </div>

      {/* Decorative desktop window controls */}
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-slate-700/60 flex items-center justify-center hover:bg-slate-600 transition-colors">
          <Minus className="w-2 h-2 text-slate-400" />
        </div>
        <div className="w-3 h-3 rounded-full bg-slate-700/60 flex items-center justify-center hover:bg-slate-600 transition-colors">
          <Square className="w-1.5 h-1.5 text-slate-400" />
        </div>
        <div className="w-3 h-3 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/80 transition-colors group">
          <X className="w-2 h-2 text-red-400 group-hover:text-white" />
        </div>
      </div>
    </div>
  );
};

