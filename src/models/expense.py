from dataclasses import dataclass
""" Data models for expenses tracker """
@dataclass
class Transaction:
    date : str
    merchant : str
    amount : float
    category : str = "Uncategorise"

@dataclass
class ExpenseSummury: 
    total_spent : float
    category_totals : dict [str,float]
    is_over_budget : bool

# if __name__ == "__main__":
#     print(Transaction(date="2026-01-01" , merchant="Amazon" , amount=100.00 , category="Shoping"))

