import React from 'react';
import { 
  CreditCard, 
  ShoppingBag, 
  Calendar,
  AlertCircle,
  CheckCircle2 
} from 'lucide-react';
import { ExpenseSummary } from '../../types';
import { formatINR } from '../../utils/formatters';

interface MetricCardsProps {
  summary: ExpenseSummary;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary }) => {
  const activeDays = Object.keys(summary.daily_velocity).length || 1;
  const dailyAverage = summary.total_spent / activeDays;
  const topCategoryAmount = summary.category_totals[summary.top_category] || 0;
  const topCategoryPct = summary.category_percentages[summary.top_category] || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Money Spent */}
      <div className="p-5 rounded-2xl bg-[#121927] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Spent
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-white tracking-tight font-mono">
            {formatINR(summary.total_spent)}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="text-purple-400 font-semibold">{summary.transaction_count}</span>
            <span>verified transactions</span>
          </p>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-colors pointer-events-none" />
      </div>

      {/* 2. Budget Health Status */}
      <div className={`p-5 rounded-2xl bg-[#121927] border relative overflow-hidden group transition-all shadow-md ${
        summary.is_over_budget ? 'border-red-500/30' : 'border-emerald-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Budget Target
          </span>
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
            summary.is_over_budget 
              ? 'bg-red-500/10 border-red-500/20 text-red-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            {summary.is_over_budget ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-white tracking-tight font-mono">
            {formatINR(summary.budget_limit)}
          </div>
          <p className={`text-xs mt-1 font-semibold flex items-center gap-1 ${
            summary.is_over_budget ? 'text-red-400' : 'text-emerald-400'
          }`}>
            {summary.is_over_budget ? (
              <span>+{formatINR(summary.overrun_amount)} Overrun</span>
            ) : (
              <span>{formatINR(summary.budget_limit - summary.total_spent)} Remaining</span>
            )}
          </p>
        </div>
      </div>

      {/* 3. Daily Spending Velocity */}
      <div className="p-5 rounded-2xl bg-[#121927] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Daily Velocity
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-white tracking-tight font-mono">
            {formatINR(dailyAverage)}
            <span className="text-xs font-normal text-slate-400 font-sans ml-1">/ day</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Across {activeDays} active spending days
          </p>
        </div>
      </div>

      {/* 4. Top Spending Category */}
      <div className="p-5 rounded-2xl bg-[#121927] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Top Burn Category
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-white tracking-tight truncate">
            {summary.top_category}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
            <span className="text-amber-400 font-bold">{formatINR(topCategoryAmount)}</span>
            <span className="text-slate-500 font-sans">({topCategoryPct.toFixed(1)}%)</span>
          </p>
        </div>
      </div>
    </div>
  );
};
