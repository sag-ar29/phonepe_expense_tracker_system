import sys
from pathlib import Path

# Add project root to sys.path so backend modules can be imported directly
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from backend.app.config.settings import get_budget_limit
from backend.app.utils.logger import setup_logger
from backend.app.services.tracker import ExpenseTrackerService

def main():
    logger = setup_logger()
    logger.info("Initializing PhonePe Expense Tracker CLI...")

    service = ExpenseTrackerService()
    summary = service.generate_summary()
    service.save_summary(summary)

    print("\n" + "=" * 55)
    print(" 🟣 PHONEPE EXPENSES ANALYSIS REPORT ")
    print("=" * 55 + "\n")
    print(f"Total Money Spent : ₹{summary.total_spent:.2f}")
    print(f"Transactions Count: {summary.transaction_count} valid, {summary.skipped_count} skipped")
    print(f"Top Spend Category: {summary.top_category}")
    print("\nSpending Breakdown by category:")
    for category, amount in summary.category_totals.items():
        pct = summary.category_percentages.get(category, 0.0)
        print(f"   • {category:<14} : ₹{amount:>8.2f}  ({pct:>4.1f}%)")

    print("\n" + "-" * 55)
    if summary.is_over_budget:
        print(f"⚠️  WARNING: You have exceeded your monthly budget of ₹{summary.budget_limit:.2f}!")
        print(f"    Overrun Amount : ₹{summary.overrun_amount:.2f}")
    else:
        remaining = summary.budget_limit - summary.total_spent
        print(f"✅ CONGRATULATIONS: You are within your budget limit of ₹{summary.budget_limit:.2f}.")
        print(f"    Remaining Budget: ₹{remaining:.2f}")

    if summary.skipped_lines:
        print("\n" + "-" * 55)
        print(f"⚠️  {summary.skipped_count} Line(s) Skipped during parsing:")
        for s in summary.skipped_lines:
            print(f"   Line {s.line_number}: \"{s.raw_text}\" -> {s.reason}")

    print("=" * 55 + "\n")

if __name__ == "__main__":
    main()
