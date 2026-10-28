import csv
import json
import logging
from pathlib import Path
from typing import List
from backend.app.models.expense import Transaction, ExpenseSummary

logger = logging.getLogger("PhonePeTracker")

class ExporterService:
    """Exports transaction ledgers and analysis summaries to standard formats."""

    @staticmethod
    def export_to_csv(transactions: List[Transaction], output_path: Path) -> bool:
        try:
            path = Path(output_path)
            path.parent.mkdir(parents=True, exist_ok=True)
            with open(path, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow(["Line", "Date", "Merchant", "Category", "Amount (INR)"])
                for txn in transactions:
                    writer.writerow([
                        txn.line_number or "-",
                        txn.date,
                        txn.merchant,
                        txn.category,
                        f"{txn.amount:.2f}"
                    ])
            logger.info(f"Successfully exported {len(transactions)} rows to CSV at {path}")
            return True
        except Exception as e:
            logger.error(f"Failed to export CSV to {output_path}: {e}")
            return False

    @staticmethod
    def export_to_json(summary: ExpenseSummary, output_path: Path) -> bool:
        try:
            path = Path(output_path)
            path.parent.mkdir(parents=True, exist_ok=True)
            with open(path, "w", encoding="utf-8") as f:
                json.dump(summary.to_dict(), f, indent=4)
            logger.info(f"Successfully exported summary to JSON at {path}")
            return True
        except Exception as e:
            logger.error(f"Failed to export JSON to {output_path}: {e}")
            return False

