export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatCompactINR(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${amount.toFixed(0)}`;
}

export function formatDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; fill: string; border: string }> = {
  Shopping: { bg: 'bg-purple-500/10', text: 'text-purple-400', fill: '#9333ea', border: 'border-purple-500/30' },
  Bills: { bg: 'bg-blue-500/10', text: 'text-blue-400', fill: '#3b82f6', border: 'border-blue-500/30' },
  Food: { bg: 'bg-amber-500/10', text: 'text-amber-400', fill: '#f59e0b', border: 'border-amber-500/30' },
  Travel: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', fill: '#06b6d4', border: 'border-cyan-500/30' },
  Health: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', fill: '#10b981', border: 'border-emerald-500/30' },
  Entertainment: { bg: 'bg-pink-500/10', text: 'text-pink-400', fill: '#ec4899', border: 'border-pink-500/30' },
  Other: { bg: 'bg-slate-500/10', text: 'text-slate-400', fill: '#64748b', border: 'border-slate-500/30' },
};

export const CATEGORY_ICONS: Record<string, string> = {
  Shopping: '🛍️',
  Bills: '⚡',
  Food: '🍔',
  Travel: '🚗',
  Health: '💊',
  Entertainment: '🎬',
  Other: '📦',
};

