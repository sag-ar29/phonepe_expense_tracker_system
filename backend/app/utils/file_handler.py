import json
import logging
from pathlib import Path
from typing import List, Dict, Any

logger = logging.getLogger("PhonePeTracker")

def read_text_file(file_path: Path) -> List[str]:
    """Read lines from a text or CSV file safely."""
    path = Path(file_path)
    if not path.exists():
        logger.error(f"File not found: {path}")
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.readlines()
    except Exception as e:
        logger.error(f"Error reading file {path}: {e}")
        return []

def write_json_file(data: Dict[str, Any], output_path: Path) -> bool:
    """Save dictionary to a formatted JSON file."""
    path = Path(output_path)
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)
        logger.info(f"Data written to {path}")
        return True
    except Exception as e:
        logger.error(f"Error writing JSON to {path}: {e}")
        return False

