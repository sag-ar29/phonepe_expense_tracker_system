from src.config.setting import BUDGET_LIMIT
from src.utils.logger import setup_logger
from src.services.tracker import ExpenseTrackerService

def main():
    logger = setup_logger()
    logger.info("initializing PhonePe Expense Tracker .... ")

    service = ExpenseTrackerService()

    summary = service.generate_summary()
    service.save_summary(summary)

    print("\n" + "="*50)
    print(" PHONEPE EXPENSES ANALYSIS REPORT ")
    print("="*50 + "\n")
    print("Total Money Spent :{summary.totals_spent:.2f}")
    print(f"\n Spending Breakdown by category :")
    for category , amount in summary.category_totals.items():
        print( f"        {category:.12s}  : Rs{amount:.2f}")

    print("*"*50)

    if summary.is_over_budget:
        print(f"\n WARNNING : You have excedeed your monthly budget of rs{BUDGET_LIMIT}")
    else:
        print(f"\n Congratulation! You are within your budget limit of rs{BUDGET_LIMIT}")

    print("="*50 + "\n")

if __name__ == "__main__":
    main()

