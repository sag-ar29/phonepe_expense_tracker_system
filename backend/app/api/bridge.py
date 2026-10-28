import logging
from pathlib import Path
from typing import Dict, Any, Optional

import webview
from backend.app.services.tracker import ExpenseTrackerService
from backend.app.services.exporter import ExporterService
from backend.app.config.settings import (
    DATA_FILE_PATH,
    OUTPUT_JSON_PATH,
    set_budget_limit,
    get_budget_limit,
)

logger = logging.getLogger("PhonePeTracker")

class DesktopBridgeAPI:
    """
    Exposes high-performance Python methods to the React frontend
    via the PyWebView JavaScript-to-Python IPC bridge (window.pywebview.api).
    """

    def __init__(self):
        self.service = ExpenseTrackerService()
        self.current_summary = None

    def get_summary(self) -> Dict[str, Any]:
        """Fetch current expense summary and budget analytics."""
        try:
            self.current_summary = self.service.generate_summary()
            self.service.save_summary(self.current_summary)
            return {"success": True, "data": self.current_summary.to_dict()}
        except Exception as e:
            logger.error(f"Error generating summary: {e}")
            return {"success": False, "error": str(e)}

    def parse_statement(self, raw_text: str) -> Dict[str, Any]:
        """Parse dropped or uploaded statement content and recalculate analytics."""
        try:
            txns, skipped = self.service.parse_from_text(raw_text)
            self.current_summary = self.service.generate_summary(transactions=txns, skipped_lines=skipped)
            self.service.save_summary(self.current_summary)
            return {"success": True, "data": self.current_summary.to_dict()}
        except Exception as e:
            logger.error(f"Error parsing statement: {e}")
            return {"success": False, "error": str(e)}

    def select_file_dialog(self) -> Dict[str, Any]:
        """Open native Windows File Explorer dialog to pick a transaction statement."""
        try:
            active_window = webview.windows[0] if webview.windows else None
            if not active_window:
                return {"success": False, "error": "No active window"}

            file_types = ("Statement Files (*.txt;*.csv)", "All Files (*.*)")
            file_result = active_window.create_file_dialog(
                webview.OPEN_DIALOG,
                allow_multiple=False,
                file_types=file_types
            )

            if not file_result:
                return {"success": False, "cancelled": True}

            file_path = Path(file_result[0])
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            txns, skipped = self.service.parse_from_text(content)
            self.current_summary = self.service.generate_summary(transactions=txns, skipped_lines=skipped)
            self.service.save_summary(self.current_summary)

            return {
                "success": True,
                "file_name": file_path.name,
                "file_path": str(file_path),
                "data": self.current_summary.to_dict()
            }
        except Exception as e:
            logger.error(f"Error selecting file: {e}")
            return {"success": False, "error": str(e)}

    def update_budget(self, new_limit: float) -> Dict[str, Any]:
        """Update and persist monthly budget limit, recalculating overrun status."""
        try:
            limit = float(new_limit)
            if limit <= 0:
                return {"success": False, "error": "Budget limit must be greater than 0"}

            set_budget_limit(limit)
            self.service.budget_limit = limit

            # Recalculate with new budget limit
            txns = self.current_summary.transactions if self.current_summary else None
            skipped = self.current_summary.skipped_lines if self.current_summary else None
            self.current_summary = self.service.generate_summary(transactions=txns, skipped_lines=skipped)
            self.service.save_summary(self.current_summary)

            return {
                "success": True,
                "new_limit": limit,
                "data": self.current_summary.to_dict()
            }
        except Exception as e:
            logger.error(f"Error updating budget limit: {e}")
            return {"success": False, "error": str(e)}

    def export_report(self, format_type: str = "csv") -> Dict[str, Any]:
        """Trigger native Windows Save dialog to export transactions or analysis."""
        try:
            active_window = webview.windows[0] if webview.windows else None
            if not active_window:
                return {"success": False, "error": "No active window"}

            if not self.current_summary:
                self.current_summary = self.service.generate_summary()

            fmt = format_type.lower()
            if fmt == "csv":
                file_types = ("CSV Document (*.csv)",)
                default_name = "PhonePe_Expense_Ledger.csv"
            else:
                file_types = ("JSON Document (*.json)",)
                default_name = "PhonePe_Expense_Summary.json"

            save_result = active_window.create_file_dialog(
                webview.SAVE_DIALOG,
                save_filename=default_name,
                file_types=file_types
            )

            if not save_result:
                return {"success": False, "cancelled": True}

            out_path = Path(save_result if isinstance(save_result, str) else save_result[0])
            if fmt == "csv":
                ExporterService.export_to_csv(self.current_summary.transactions, out_path)
            else:
                ExporterService.export_to_json(self.current_summary, out_path)

            return {"success": True, "saved_path": str(out_path)}
        except Exception as e:
            logger.error(f"Error exporting report: {e}")
            return {"success": False, "error": str(e)}

    def load_demo_statement(self) -> Dict[str, Any]:
        """Loads default sample statement (data/transactions.txt) for 1-click test."""
        try:
            if not DATA_FILE_PATH.exists():
                return {"success": False, "error": f"Sample statement not found at {DATA_FILE_PATH}"}

            with open(DATA_FILE_PATH, "r", encoding="utf-8") as f:
                content = f.read()

            return self.parse_statement(content)
        except Exception as e:
            logger.error(f"Error loading demo statement: {e}")
            return {"success": False, "error": str(e)}

