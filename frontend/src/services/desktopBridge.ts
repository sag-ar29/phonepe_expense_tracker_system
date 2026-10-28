import { ExpenseSummary, BridgeResponse } from '../types';

// Mock data based on the real transactions.txt for fallback/web preview
const FALLBACK_DEMO_DATA: ExpenseSummary = {
  total_spent: 15346.00,
  budget_limit: 10000.00,
  is_over_budget: true,
  overrun_amount: 5346.00,
  top_category: 'Shopping',
  transaction_count: 24,
  skipped_count: 1,
  category_totals: {
    Shopping: 5738.00,
    Bills: 3608.00,
    Food: 2480.00,
    Travel: 2320.00,
    Health: 1200.00,
  },
  category_percentages: {
    Shopping: 37.4,
    Bills: 23.5,
    Food: 16.2,
    Travel: 15.1,
    Health: 7.8,
  },
  daily_velocity: {
    '2026-08-01': 350,
    '2026-08-02': 180,
    '2026-08-03': 1450,
    '2026-08-04': 220,
    '2026-08-05': 600,
    '2026-08-06': 999,
    '2026-08-07': 60,
    '2026-08-08': 299,
    '2026-08-10': 40,
    '2026-08-11': 1299,
    '2026-08-12': 215,
    '2026-08-13': 1850,
    '2026-08-14': 850,
    '2026-08-15': 799,
    '2026-08-16': 500,
    '2026-08-17': 1750,
    '2026-08-18': 75,
    '2026-08-19': 420,
    '2026-08-20': 350,
    '2026-08-21': 750,
    '2026-08-22': 240,
    '2026-08-23': 540,
    '2026-08-24': 310,
    '2026-08-25': 1200,
  },
  transactions: [
    { date: '2026-08-01', merchant: 'Swiggy', amount: 350, category: 'Food', line_number: 1 },
    { date: '2026-08-02', merchant: 'Uber Ride', amount: 180, category: 'Travel', line_number: 2 },
    { date: '2026-08-03', merchant: 'DMart Supermarket', amount: 1450, category: 'Shopping', line_number: 3 },
    { date: '2026-08-04', merchant: 'Zomato Food', amount: 220, category: 'Food', line_number: 4 },
    { date: '2026-08-05', merchant: 'Petrol Pump HPCL', amount: 600, category: 'Travel', line_number: 5 },
    { date: '2026-08-06', merchant: 'Amazon Purchase', amount: 999, category: 'Shopping', line_number: 6 },
    { date: '2026-08-07', merchant: 'Canteen Snacks', amount: 60, category: 'Food', line_number: 7 },
    { date: '2026-08-08', merchant: 'Mobile Recharge Jio', amount: 299, category: 'Bills', line_number: 8 },
    { date: '2026-08-10', merchant: 'Tea Stall', amount: 40, category: 'Food', line_number: 10 },
    { date: '2026-08-11', merchant: 'Flipkart Order', amount: 1299, category: 'Shopping', line_number: 11 },
    { date: '2026-08-12', merchant: 'Ola Mini Ride', amount: 215, category: 'Travel', line_number: 12 },
    { date: '2026-08-13', merchant: 'Electricity Bill Bescom', amount: 1850, category: 'Bills', line_number: 13 },
    { date: '2026-08-14', merchant: 'Restaurant Dinner', amount: 850, category: 'Food', line_number: 14 },
    { date: '2026-08-15', merchant: 'Broadband Wifi Bill Airtel', amount: 799, category: 'Bills', line_number: 15 },
    { date: '2026-08-16', merchant: 'Metro Card Recharge', amount: 500, category: 'Travel', line_number: 16 },
    { date: '2026-08-17', merchant: 'Myntra Fashion Shopping', amount: 1750, category: 'Shopping', line_number: 17 },
    { date: '2026-08-18', merchant: 'Rapido Bike Taxi', amount: 75, category: 'Travel', line_number: 18 },
    { date: '2026-08-19', merchant: 'Swiggy Instamart', amount: 420, category: 'Food', line_number: 19 },
    { date: '2026-08-20', merchant: 'Cinema Movie Ticket', amount: 350, category: 'Bills', line_number: 20 },
    { date: '2026-08-21', merchant: 'Petrol Pump BPCL', amount: 750, category: 'Travel', line_number: 21 },
    { date: '2026-08-22', merchant: 'Pharmacy Medical Store', amount: 240, category: 'Shopping', line_number: 22 },
    { date: '2026-08-23', merchant: 'Zomato Delivery', amount: 540, category: 'Food', line_number: 23 },
    { date: '2026-08-24', merchant: 'Water Bill Payment', amount: 310, category: 'Bills', line_number: 24 },
    { date: '2026-08-25', merchant: 'Gym Membership', amount: 1200, category: 'Health', line_number: 25 },
  ],
  skipped_lines: [
    {
      line_number: 9,
      raw_text: '2026-08-09, Invalid Line Without Comma',
      reason: 'Missing required fields (expected 3, got 2)',
    },
  ],
};

class DesktopBridgeClient {
  private isDesktopAvailable(): boolean {
    return typeof window !== 'undefined' && Boolean(window.pywebview?.api);
  }

  async getSummary(): Promise<BridgeResponse<ExpenseSummary>> {
    if (this.isDesktopAvailable()) {
      return await window.pywebview!.api.get_summary();
    }
    return { success: true, data: FALLBACK_DEMO_DATA };
  }

  async parseStatement(rawText: string): Promise<BridgeResponse<ExpenseSummary>> {
    if (this.isDesktopAvailable()) {
      return await window.pywebview!.api.parse_statement(rawText);
    }
    // Web fallback simulator
    return { success: true, data: FALLBACK_DEMO_DATA };
  }

  async selectFileDialog(): Promise<BridgeResponse<ExpenseSummary>> {
    if (this.isDesktopAvailable()) {
      return await window.pywebview!.api.select_file_dialog();
    }
    return { success: true, file_name: 'demo_transactions.txt', data: FALLBACK_DEMO_DATA };
  }

  async updateBudget(newLimit: number): Promise<BridgeResponse<ExpenseSummary>> {
    if (this.isDesktopAvailable()) {
      return await window.pywebview!.api.update_budget(newLimit);
    }
    const updated = {
      ...FALLBACK_DEMO_DATA,
      budget_limit: newLimit,
      is_over_budget: FALLBACK_DEMO_DATA.total_spent > newLimit,
      overrun_amount: Math.max(0, FALLBACK_DEMO_DATA.total_spent - newLimit),
    };
    return { success: true, data: updated };
  }

  async exportReport(formatType: 'csv' | 'json'): Promise<BridgeResponse> {
    if (this.isDesktopAvailable()) {
      return await window.pywebview!.api.export_report(formatType);
    }
    return { success: true, saved_path: `PhonePe_Expense_${formatType.toUpperCase()}_demo.${formatType}` };
  }

  async loadDemoStatement(): Promise<BridgeResponse<ExpenseSummary>> {
    if (this.isDesktopAvailable()) {
      return await window.pywebview!.api.load_demo_statement();
    }
    return { success: true, data: FALLBACK_DEMO_DATA };
  }
}

export const bridge = new DesktopBridgeClient();

