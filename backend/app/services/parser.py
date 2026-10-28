import logging
from typing import List, Tuple
from backend.app.models.expense import Transaction, SkippedLine
from backend.app.services.categorizer import get_category

logger = logging.getLogger("PhonePeTracker")

class StatementParser:
    """Parses statement text lines into validated Transactions and SkippedLines."""

    @staticmethod
    def parse_lines(raw_lines: List[str]) -> Tuple[List[Transaction], List[SkippedLine]]:
        transactions: List[Transaction] = []
        skipped_lines: List[SkippedLine] = []

        for idx, line in enumerate(raw_lines):
            line_number = idx + 1
            clean_line = line.strip()

            if not clean_line or clean_line.startswith("#"):
                continue

            # Support comma-separated (standard) or tab-separated lines
            delimiter = "," if "," in clean_line else "\t"
            parts = [p.strip() for p in clean_line.split(delimiter)]

            if len(parts) < 3:
                reason = f"Missing required fields (expected 3, got {len(parts)})"
                logger.warning(f"Line {line_number} skipped: {reason}")
                skipped_lines.append(SkippedLine(line_number=line_number, raw_text=clean_line, reason=reason))
                continue

            date_str, merchant_str, amount_str = parts[0], parts[1], parts[2]

            try:
                # Clean amount string (remove Currency symbols like Rs, ₹ if present)
                clean_amt = amount_str.replace("Rs", "").replace("₹", "").replace(",", "").strip()
                amount = float(clean_amt)
                if amount < 0:
                    raise ValueError("Amount cannot be negative")
            except Exception as e:
                reason = f"Invalid amount format '{amount_str}': {e}"
                logger.warning(f"Line {line_number} skipped: {reason}")
                skipped_lines.append(SkippedLine(line_number=line_number, raw_text=clean_line, reason=reason))
                continue

            # Determine category if not explicitly provided as 4th column
            category = parts[3] if len(parts) >= 4 and parts[3] else get_category(merchant_str)

            transactions.append(
                Transaction(
                    date=date_str,
                    merchant=merchant_str,
                    amount=amount,
                    category=category,
                    line_number=line_number
                )
            )

        logger.info(f"Parsed {len(transactions)} transactions, skipped {len(skipped_lines)} invalid lines.")
        return transactions, skipped_lines

    @classmethod
    def parse_raw_text(cls, text_content: str) -> Tuple[List[Transaction], List[SkippedLine]]:
        """Parses a multi-line raw string."""
        return cls.parse_lines(text_content.splitlines())

