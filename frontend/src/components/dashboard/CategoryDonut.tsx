import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ExpenseSummary } from '../../types';
import { formatINR, CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/formatters';

interface CategoryDonutProps {
  summary: ExpenseSummary;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryDonut: React.FC<CategoryDonutProps> = ({
  summary,
  selectedCategory,
  onSelectCategory,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = Object.entries(summary.category_totals).map(([name, value]) => ({
    name,
    value,
    percentage: summary.category_percentages[name] || 0,
    color: CATEGORY_COLORS[name]?.fill || '#8b5cf6',
  }));

  const hoveredItem = activeIndex !== null ? chartData[activeIndex] : null;

  return (
    <div className="p-6 rounded-2xl bg-[#121927] border border-white/5 flex flex-col justify-between shadow-md">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Category Breakdown</h3>
            <p className="text-xs text-slate-400">Spending distribution across categories</p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => onSelectCategory(null)}
              className="text-xs text-purple-400 hover:text-purple-300 font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Donut Chart Container */}
        <div className="relative h-64 mt-4 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="px-3 py-2 rounded-xl bg-[#0b0f17] border border-white/10 shadow-xl text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <span>{CATEGORY_ICONS[data.name] || '🏷️'}</span>
                          <span>{data.name}</span>
                        </div>
                        <div className="text-purple-300 font-mono font-bold">
                          {formatINR(data.value)}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {data.percentage.toFixed(1)}% of total spend
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={(entry) => onSelectCategory(selectedCategory === entry.name ? null : entry.name)}
                cursor="pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#0b0f17"
                    strokeWidth={2}
                    className="transition-all duration-300 hover:opacity-90"
                    style={{
                      filter: selectedCategory === entry.name ? 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))' : undefined,
                      transform: activeIndex === index ? 'scale(1.03)' : 'scale(1)',
                      transformOrigin: 'center center',
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Metric Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[11px] text-slate-400 font-medium">
              {hoveredItem ? hoveredItem.name : 'Total Spent'}
            </span>
            <span className="text-lg font-black text-white font-mono tracking-tight">
              {hoveredItem ? formatINR(hoveredItem.value) : formatINR(summary.total_spent)}
            </span>
            <span className="text-[10px] text-purple-400 font-semibold">
              {hoveredItem ? `${hoveredItem.percentage.toFixed(1)}%` : `${summary.transaction_count} Txns`}
            </span>
          </div>
        </div>
      </div>

      {/* Category Legend Pills */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
        {chartData.map((item) => {
          const isSelected = selectedCategory === item.name;
          return (
            <button
              key={item.name}
              onClick={() => onSelectCategory(isSelected ? null : item.name)}
              className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                isSelected
                  ? 'bg-purple-500/20 border border-purple-500/40 text-white'
                  : 'bg-white/[0.02] hover:bg-white/5 text-slate-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
              </div>
              <span className="font-mono text-slate-400 text-[11px] ml-1 shrink-0 font-medium">
                {item.percentage.toFixed(0)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

