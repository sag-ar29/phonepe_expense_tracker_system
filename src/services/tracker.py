from ipaddress import summarize_address_range
import logging
from dataclasses import asdict
from src.models.expense import ExpenseSummury ,Transaction
from src.services.categorizer import get_category
from src.utils.decorators import timer
from src.config.setting import BUDGET_LIMIT,DATA_FILE_PATH,OUTPUT_JSON_PATH
from src.utils.file_handler import read_text_file, write_json_file


logger = logging.getLogger("PhonePeTracer")

class ExpenseTrackerService:
    def __init__(self, data_path = DATA_FILE_PATH,budget_limit = BUDGET_LIMIT) :
        self.data_path= data_path
        self.budget_limit = budget_limit
    @timer
    def parse_transaction(self) -> list[Transaction]:
        """Parser the transaction data from the text file """
        raw_line  = read_text_file(self.data_path)
        transaction : list[Transaction]= []
        for line_number ,line in enumerate(raw_line):
                line_str = line.strip()
                if not line_str:
                    continue
                try:

                    date , merchant , amount_str = line_str.split(",")
                    amount = float(amount_str)
                    category = get_category(merchant)
                    transaction.append(Transaction(date.strip(),merchant.strip(), amount, category))
                except Exception as e:
                  logger.error(f"Skipped {line_number} transaction due to error:{e}")
        return transaction
    @timer
    def generate_summary (self) -> ExpenseSummury:
        transactions : list[Transaction] = self.parse_transaction()
        totals: dict[str,float] = {}
        total_spent : float = 0.0
        for txn in transactions:
            totals[txn.category]= totals.get(txn.category,0.0) + txn.amount
            total_spent+=txn.amount
        return ExpenseSummury(
            total_spent = round(total_spent,2),
            category_totals={ k : round(v,2) for k,v in totals.items()},
            is_over_budget=total_spent > self.budget_limit)

    def save_summary(self ,summary ,output_path = OUTPUT_JSON_PATH)-> None:
        """Save the summury to a json file """
        write_json_file(asdict(summary),output_path)
    