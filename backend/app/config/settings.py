import os
import sys
import json
import shutil
from pathlib import Path
import logging

logger = logging.getLogger("PhonePeTracker")

# Detect frozen standalone execution (PyInstaller)
IS_FROZEN = getattr(sys, "frozen", False)

if IS_FROZEN:
    # Read-only bundled assets live in temporary _MEIPASS
    BUNDLE_DIR = Path(sys._MEIPASS)
    # Writable user files live next to the .exe file
    BASE_DIR = Path(sys.executable).resolve().parent
    DATA_DIR = BASE_DIR / "phonepe_data"
    LOGS_DIR = BASE_DIR / "phonepe_logs"
else:
    BUNDLE_DIR = Path(__file__).resolve().parent.parent.parent
    BASE_DIR = BUNDLE_DIR
    DATA_DIR = BASE_DIR / "data"
    LOGS_DIR = BASE_DIR / "logs"

ROOT_DIR = BASE_DIR.parent if not IS_FROZEN else BASE_DIR

DATA_DIR.mkdir(parents=True, exist_ok=True)
LOGS_DIR.mkdir(parents=True, exist_ok=True)

CONFIG_FILE_PATH = DATA_DIR / "user_config.json"
DATA_FILE_PATH = DATA_DIR / "transactions.txt"
OUTPUT_JSON_PATH = DATA_DIR / "summary.json"
LOG_FILE_PATH = LOGS_DIR / "tracker.log"

# If in frozen mode and transactions.txt doesn't exist in user data directory, seed with sample
if IS_FROZEN and not DATA_FILE_PATH.exists():
    bundled_sample = BUNDLE_DIR / "backend" / "data" / "transactions.txt"
    if not bundled_sample.exists():
        bundled_sample = BUNDLE_DIR / "data" / "transactions.txt"
    if bundled_sample.exists():
        try:
            shutil.copy(bundled_sample, DATA_FILE_PATH)
        except Exception as e:
            logger.warning(f"Could not seed sample statement: {e}")

def _load_env_file(env_path: Path) -> None:
    """Read key=value pairs from .env into os.environ if present."""
    if not env_path.exists():
        return
    try:
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())
    except Exception as e:
        logger.error(f"Error loading .env from {env_path}: {e}")

_load_env_file(BASE_DIR / ".env")

def get_budget_limit() -> float:
    """Retrieve current budget limit, prioritizing user_config.json then .env."""
    if CONFIG_FILE_PATH.exists():
        try:
            with open(CONFIG_FILE_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                if "budget_limit" in data:
                    return float(data["budget_limit"])
        except Exception as e:
            logger.warning(f"Could not read budget limit from {CONFIG_FILE_PATH}: {e}")
    return float(os.getenv("BUDGET_LIMIT", 10000.0))

def set_budget_limit(new_limit: float) -> bool:
    """Persist new budget limit to user_config.json."""
    try:
        config = {}
        if CONFIG_FILE_PATH.exists():
            with open(CONFIG_FILE_PATH, "r", encoding="utf-8") as f:
                config = json.load(f)
        config["budget_limit"] = float(new_limit)
        with open(CONFIG_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=4)
        return True
    except Exception as e:
        logger.error(f"Failed to save budget limit: {e}")
        return False

BUDGET_LIMIT: float = get_budget_limit()
