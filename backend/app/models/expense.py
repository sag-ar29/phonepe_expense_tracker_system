from dataclasses import dataclass, field, asdict
from typing import Dict, List, Optional

@dataclass
class Transaction:
    """Represents a validated single transaction line."""
    date: str
    merchant: str
    amount: float
    category: str = "Other"
    line_number: Optional[int] = None

    def to_dict(self) -> dict:
        return asdict(self)

@dataclass
class SkippedLine:
    """Represents a malformed line skipped during statement parsing."""
    line_number: int
    raw_text: str
    reason: str

    def to_dict(self) -> dict:
        return asdict(self)

@dataclass
class ExpenseSummary:
    """Comprehensive analytical summary of parsed expenses."""
    total_spent: float
    budget_limit: float
    is_over_budget: bool
    overrun_amount: float
    category_totals: Dict[str, float]
    category_percentages: Dict[str, float]
    transaction_count: int
    skipped_count: int
    top_category: str
    daily_velocity: Dict[str, float]
    transactions: List[Transaction] = field(default_factory=list)
    skipped_lines: List[SkippedLine] = field(default_factory=list)

    def to_dict(self) -> dict:
        data = asdict(self)
        # Ensure nested dataclasses are serialized cleanly
        data["transactions"] = [t.to_dict() if hasattr(t, "to_dict") else t for t in self.transactions]
        data["skipped_lines"] = [s.to_dict() if hasattr(s, "to_dict") else s for s in self.skipped_lines]
        return data

