import React, { useState, useEffect } from 'react';
import { Titlebar } from './components/layout/Titlebar';
import { Header } from './components/layout/Header';
import { FileDropzone } from './components/upload/FileDropzone';
import { HealthModal } from './components/upload/HealthModal';
import { BudgetBanner } from './components/dashboard/BudgetBanner';
import { MetricCards } from './components/dashboard/MetricCards';
import { CategoryDonut } from './components/dashboard/CategoryDonut';
import { TimelineChart } from './components/dashboard/TimelineChart';
import { TransactionTable } from './components/ledger/TransactionTable';
import { BudgetModal } from './components/settings/BudgetModal';
import { bridge } from './services/desktopBridge';
import { ExpenseSummary } from './types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Auto-dismiss toast
  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  // Initial load
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const res = await bridge.getSummary();
        if (res.success && res.data) {
          setSummary(res.data);
        }
      } catch (err) {
        console.error('Failed to initialize summary:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, []);

  // Handlers
  const handleStatementUploaded = async (content: string, fileName?: string) => {
    setIsLoading(true);
    try {
      const res = await bridge.parseStatement(content);
      if (res.success && res.data) {
        setSummary(res.data);
        showToast(`Parsed ${res.data.transaction_count} transactions from ${fileName || 'statement'}!`);
      }
    } catch (err) {
      console.error('Error parsing statement:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFileDialog = async () => {
    setIsLoading(true);
    try {
      const res = await bridge.selectFileDialog();
      if (res.success && res.data) {
        setSummary(res.data);
        showToast(`Loaded ${res.file_name || 'statement'} successfully!`);
      }
    } catch (err) {
      console.error('Error selecting file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemo = async () => {
    setIsLoading(true);
    try {
      const res = await bridge.loadDemoStatement();
      if (res.success && res.data) {
        setSummary(res.data);
        showToast('Sample PhonePe statement loaded!');
      }
    } catch (err) {
      console.error('Error loading demo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBudget = async (newLimit: number) => {
    try {
      const res = await bridge.updateBudget(newLimit);
      if (res.success && res.data) {
        setSummary(res.data);
        showToast(`Budget limit updated to ₹${newLimit.toLocaleString()}`);
      }
    } catch (err) {
      console.error('Error updating budget:', err);
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const res = await bridge.exportReport(format);
      if (res.success && !res.cancelled) {
        showToast(`Report exported to ${res.saved_path || format.toUpperCase()}`);
      }
    } catch (err) {
      console.error('Error exporting report:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0b0f17] text-slate-100 overflow-hidden select-none">
      {/* 1. Custom Frameless Titlebar */}
      <Titlebar />

      {/* 2. Brand & Navigation Header */}
      <Header
        summary={summary}
        isLoading={isLoading}
        onSelectFile={handleSelectFileDialog}
        onLoadDemo={handleLoadDemo}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenHealthModal={() => setIsHealthModalOpen(true)}
        onExport={handleExport}
      />

      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/90 text-white text-xs font-semibold shadow-2xl backdrop-blur-md border border-purple-400/40 animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{notification}</span>
        </div>
      )}

      {/* 3. Main Scrollable Dashboard Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* File Dropzone Area */}
          <FileDropzone
            onStatementUploaded={handleStatementUploaded}
            isLoading={isLoading}
          />

          {summary && summary.transaction_count > 0 ? (
            <>
              {/* Budget Overrun Banner */}
              <BudgetBanner
                totalSpent={summary.total_spent}
                budgetLimit={summary.budget_limit}
                isOverBudget={summary.is_over_budget}
                overrunAmount={summary.overrun_amount}
                onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              />

              {/* KPI Metric Cards */}
              <MetricCards summary={summary} />

              {/* Visual Analytics Row: Donut + Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryDonut
                  summary={summary}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
                <TimelineChart summary={summary} />
              </div>

              {/* Ledger Explorer */}
              <TransactionTable
                transactions={summary.transactions}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </>
          ) : (
            <div className="py-16 text-center rounded-2xl bg-[#121927] border border-white/5 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No Statement Loaded</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Drop your PhonePe <code className="text-purple-300">transactions.txt</code> statement above, or click "Try Demo" to view sample analytics.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {summary && (
        <>
          <HealthModal
            isOpen={isHealthModalOpen}
            onClose={() => setIsHealthModalOpen(false)}
            validCount={summary.transaction_count}
            skippedLines={summary.skipped_lines}
          />

          <BudgetModal
            isOpen={isBudgetModalOpen}
            onClose={() => setIsBudgetModalOpen(false)}
            currentLimit={summary.budget_limit}
            totalSpent={summary.total_spent}
            onSaveLimit={handleUpdateBudget}
          />
        </>
      )}
    </div>
  );
};

