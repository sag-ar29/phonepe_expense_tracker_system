import logging
from pathlib import Path
from typing import Dict, List, Optional
from collections import defaultdict

from backend.app.models.expense import Transaction, SkippedLine, ExpenseSummary
from backend.app.services.parser import StatementParser
from backend.app.config.settings import DATA_FILE_PATH, OUTPUT_JSON_PATH, get_budget_limit
from backend.app.utils.decorators import timer
from backend.app.utils.file_handler import read_text_file, write_json_file

logger = logging.getLogger("PhonePeTracker")

class ExpenseTrackerService:
    """Core domain service for parsing statements and generating financial analytics."""

    def __init__(self, data_path: Optional[Path] = None, budget_limit: Optional[float] = None):
        self.data_path = Path(data_path) if data_path else DATA_FILE_PATH
        self.budget_limit = budget_limit if budget_limit is not None else get_budget_limit()

    @timer
    def parse_from_file(self, file_path: Optional[Path] = None) -> tuple[List[Transaction], List[SkippedLine]]:
        """Reads transactions from the designated file path."""
        target_path = Path(file_path) if file_path else self.data_path
        lines = read_text_file(target_path)
        return StatementParser.parse_lines(lines)

    @timer
    def parse_from_text(self, raw_text: str) -> tuple[List[Transaction], List[SkippedLine]]:
        """Parses transactions from uploaded or pasted string content."""
        return StatementParser.parse_raw_text(raw_text)

    @timer
    def generate_summary(
        self,
        transactions: Optional[List[Transaction]] = None,
        skipped_lines: Optional[List[SkippedLine]] = None
    ) -> ExpenseSummary:
        """Computes comprehensive analytics, category totals, and budget status."""
        if transactions is None:
            transactions, skipped_lines = self.parse_from_file()

        skipped_lines = skipped_lines or []

        category_totals: Dict[str, float] = defaultdict(float)
        daily_velocity: Dict[str, float] = defaultdict(float)
        total_spent = 0.0

        for txn in transactions:
            category_totals[txn.category] += txn.amount
            daily_velocity[txn.date] += txn.amount
            total_spent += txn.amount

        total_spent = round(total_spent, 2)
        budget = round(self.budget_limit, 2)
        is_over = total_spent > budget
        overrun = round(max(0.0, total_spent - budget), 2)

        # Percentages
        category_percentages: Dict[str, float] = {}
        for cat, amt in category_totals.items():
            pct = round((amt / total_spent * 100), 1) if total_spent > 0 else 0.0
            category_percentages[cat] = pct

        # Sort category totals descending
        sorted_categories = dict(sorted(category_totals.items(), key=lambda item: item[1], reverse=True))
        top_cat = list(sorted_categories.keys())[0] if sorted_categories else "None"

        # Sort daily velocity chronologically
        sorted_daily = dict(sorted(daily_velocity.items()))

        return ExpenseSummary(
            total_spent=total_spent,
            budget_limit=budget,
            is_over_budget=is_over,
            overrun_amount=overrun,
            category_totals={k: round(v, 2) for k, v in sorted_categories.items()},
            category_percentages=category_percentages,
            transaction_count=len(transactions),
            skipped_count=len(skipped_lines),
            top_category=top_cat,
            daily_velocity={k: round(v, 2) for k, v in sorted_daily.items()},
            transactions=transactions,
            skipped_lines=skipped_lines
        )

    def save_summary(self, summary: ExpenseSummary, output_path: Optional[Path] = None) -> bool:
        """Persist analysis summary to JSON."""
        target_path = Path(output_path) if output_path else OUTPUT_JSON_PATH
        return write_json_file(summary.to_dict(), target_path)

