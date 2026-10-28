export interface Transaction {
  date: string;
  merchant: string;
  amount: number;
  category: string;
  line_number?: number;
}

export interface SkippedLine {
  line_number: number;
  raw_text: string;
  reason: string;
}

export interface ExpenseSummary {
  total_spent: number;
  budget_limit: number;
  is_over_budget: boolean;
  overrun_amount: number;
  category_totals: Record<string, number>;
  category_percentages: Record<string, number>;
  transaction_count: number;
  skipped_count: number;
  top_category: string;
  daily_velocity: Record<string, number>;
  transactions: Transaction[];
  skipped_lines: SkippedLine[];
}

export interface BridgeResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  cancelled?: boolean;
  file_name?: string;
  file_path?: string;
  saved_path?: string;
}

// Window interface augmentation for pywebview
declare global {
  interface Window {
    pywebview?: {
      api: {
        get_summary(): Promise<BridgeResponse<ExpenseSummary>>;
        parse_statement(raw_text: string): Promise<BridgeResponse<ExpenseSummary>>;
        select_file_dialog(): Promise<BridgeResponse<ExpenseSummary>>;
        update_budget(new_limit: number): Promise<BridgeResponse<ExpenseSummary>>;
        export_report(format_type: 'csv' | 'json'): Promise<BridgeResponse>;
        load_demo_statement(): Promise<BridgeResponse<ExpenseSummary>>;
      };
    };
  }
}

