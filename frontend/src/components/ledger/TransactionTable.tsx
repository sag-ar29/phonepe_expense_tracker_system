import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { Transaction } from '../../types';
import { formatINR, formatDate, CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/formatters';

interface TransactionTableProps {
  transactions: Transaction[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  selectedCategory,
  onSelectCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & Search logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch =
        txn.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.date.includes(searchTerm);
      const matchesCategory = selectedCategory ? txn.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchTerm, selectedCategory]);

  // Sorting logic
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortBy === 'amount') {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
      return sortOrder === 'desc'
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date);
    });
  }, [filteredTransactions, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedTransactions.slice(start, start + itemsPerPage);
  }, [sortedTransactions, currentPage]);

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  return (
    <div className="rounded-2xl bg-[#121927] border border-white/5 overflow-hidden shadow-md">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-white">Transaction Ledger</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
            {filteredTransactions.length} of {transactions.length}
          </span>
        </div>

        {/* Search & Filter Inputs */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search merchant or date..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-1">
            <select
              value={selectedCategory || ''}
              onChange={(e) => {
                onSelectCategory(e.target.value ? e.target.value : null);
                setCurrentPage(1);
              }}
              className="py-1.5 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-purple-400"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0b0f17]/60 text-slate-400 border-b border-white/5 uppercase tracking-wider font-semibold text-[10px]">
            <tr>
              <th className="py-3 px-4 w-12">#</th>
              <th
                onClick={() => toggleSort('date')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Merchant Name</th>
              <th className="py-3 px-4">Category</th>
              <th
                onClick={() => toggleSort('amount')}
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Amount (INR)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-medium">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((txn, idx) => {
                const styling = CATEGORY_COLORS[txn.category] || CATEGORY_COLORS.Other;
                const icon = CATEGORY_ICONS[txn.category] || '🏷️';
                return (
                  <tr
                    key={idx}
                    className="hover:bg-purple-500/[0.04] transition-colors group"
                  >
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {txn.line_number || (currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap font-mono text-[11px]">
                      {formatDate(txn.date)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {txn.merchant}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[11px] font-medium ${styling.bg} ${styling.text} ${styling.border}`}
                      >
                        <span>{icon}</span>
                        <span>{txn.category}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white text-[13px]">
                      {formatINR(txn.amount)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  No transactions match your current search and filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 bg-[#0e1422]">
        <span>
          Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, sortedTransactions.length)} of{' '}
          {sortedTransactions.length}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono font-semibold text-slate-300">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
