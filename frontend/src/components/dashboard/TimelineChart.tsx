import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { ExpenseSummary } from '../../types';
import { formatINR, formatCompactINR } from '../../utils/formatters';
import { Zap } from 'lucide-react';

interface TimelineChartProps {
  summary: ExpenseSummary;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ summary }) => {
  const chartData = Object.entries(summary.daily_velocity).map(([date, amount]) => {
    const parts = date.split('-');
    const label = parts.length === 3 ? `${parts[2]} ${new Date(2026, parseInt(parts[1]) - 1).toLocaleString('default', { month: 'short' })}` : date;
    return {
      date,
      label,
      amount,
    };
  });

  const maxAmount = Math.max(...chartData.map((d) => d.amount), 0);
  const peakDay = chartData.find((d) => d.amount === maxAmount);

  return (
    <div className="p-6 rounded-2xl bg-[#121927] border border-white/5 flex flex-col justify-between shadow-md">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Daily Spending Velocity</h3>
            <p className="text-xs text-slate-400">Day-by-day expenditure timeline</p>
          </div>
          {peakDay && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Peak: {peakDay.label} ({formatINR(peakDay.amount)})</span>
            </div>
          )}
        </div>

        {/* Timeline Bar Chart Container */}
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.6} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => formatCompactINR(val)}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const isPeak = data.amount === maxAmount;
                    return (
                      <div className="px-3 py-2 rounded-xl bg-[#0b0f17] border border-white/10 shadow-xl text-xs space-y-1">
                        <div className="font-semibold text-slate-400">
                          {data.date}
                        </div>
                        <div className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                          <span>{formatINR(data.amount)}</span>
                          {isPeak && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Peak Day
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => {
                  const isPeak = entry.amount === maxAmount;
                  return (
                    <Cell
                      key={`bar-${index}`}
                      fill={isPeak ? '#a855f7' : '#5f259f'}
                      opacity={isPeak ? 1 : 0.75}
                      className="transition-all hover:opacity-100"
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/5">
        <span>Timeline spans {chartData.length} active spending entries</span>
        <span className="text-purple-400 font-medium">Auto-aggregated by Date</span>
      </div>
    </div>
  );
};

