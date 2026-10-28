import unittest
import tempfile
from pathlib import Path

from backend.app.services.parser import StatementParser
from backend.app.services.categorizer import get_category
from backend.app.services.tracker import ExpenseTrackerService
from backend.app.services.exporter import ExporterService
from backend.app.api.bridge import DesktopBridgeAPI

class TestPhonePeExpenseTracker(unittest.TestCase):

    def test_merchant_categorization(self):
        self.assertEqual(get_category("Swiggy"), "Food")
        self.assertEqual(get_category("Zomato Delivery"), "Food")
        self.assertEqual(get_category("Uber Ride"), "Travel")
        self.assertEqual(get_category("Petrol Pump BPCL"), "Travel")
        self.assertEqual(get_category("Amazon Purchase"), "Shopping")
        self.assertEqual(get_category("Electricity Bill Bescom"), "Bills")
        self.assertEqual(get_category("Gym Membership"), "Health")
        self.assertEqual(get_category("Random Person UPI"), "Other")

    def test_parser_with_valid_and_invalid_lines(self):
        sample_lines = [
            "2026-08-01, Swiggy, 350",
            "2026-08-02, Uber Ride, 180",
            "2026-08-09, Invalid Line Without Comma",  # Invalid (2 parts)
            "2026-08-10, Tea Stall, not_a_number",    # Invalid (amount NaN)
            "2026-08-13, Electricity Bill Bescom, ₹1850", # Currency symbol
        ]
        txns, skipped = StatementParser.parse_lines(sample_lines)

        self.assertEqual(len(txns), 3)
        self.assertEqual(len(skipped), 2)

        # Check valid transactions
        self.assertEqual(txns[0].amount, 350.0)
        self.assertEqual(txns[0].category, "Food")
        self.assertEqual(txns[2].amount, 1850.0)
        self.assertEqual(txns[2].category, "Bills")

        # Check skipped diagnostics
        self.assertEqual(skipped[0].line_number, 3)
        self.assertIn("Missing required fields", skipped[0].reason)
        self.assertEqual(skipped[1].line_number, 4)
        self.assertIn("Invalid amount format", skipped[1].reason)

    def test_expense_summary_and_budget_overrun(self):
        txns, skipped = StatementParser.parse_lines([
            "2026-08-01, Swiggy, 5000",
            "2026-08-02, DMart Supermarket, 6000",
        ])
        service = ExpenseTrackerService(budget_limit=10000.0)
        summary = service.generate_summary(transactions=txns, skipped_lines=skipped)

        self.assertEqual(summary.total_spent, 11000.0)
        self.assertTrue(summary.is_over_budget)
        self.assertEqual(summary.overrun_amount, 1000.0)
        self.assertEqual(summary.top_category, "Shopping")
        self.assertEqual(summary.category_totals["Shopping"], 6000.0)
        self.assertEqual(summary.category_totals["Food"], 5000.0)

    def test_bridge_api_statement_parsing(self):
        bridge = DesktopBridgeAPI()
        raw_text = (
            "2026-08-01, Swiggy, 350\n"
            "2026-08-02, Uber, 150\n"
            "Invalid Line\n"
        )
        res = bridge.parse_statement(raw_text)

        self.assertTrue(res["success"])
        data = res["data"]
        self.assertEqual(data["total_spent"], 500.0)
        self.assertEqual(data["transaction_count"], 2)
        self.assertEqual(data["skipped_count"], 1)

    def test_csv_exporter(self):
        txns, _ = StatementParser.parse_lines(["2026-08-01, Swiggy, 350"])
        with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
            tmp_path = Path(tmp.name)

        success = ExporterService.export_to_csv(txns, tmp_path)
        self.assertTrue(success)
        self.assertTrue(tmp_path.exists())

        content = tmp_path.read_text(encoding="utf-8")
        self.assertIn("Swiggy", content)
        self.assertIn("350.00", content)
        tmp_path.unlink()

if __name__ == "__main__":
    unittest.main()
