import time
import logging
from typing import Callable, Any

logger = logging.getLogger("PhonePeTracker")

def timer(func: Callable) -> Callable:
    """Decorator to measure and log execution duration of a function."""
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start_time
        logger.info(f"Execution of {func.__name__} took {duration:.6f} seconds.")
        return result
    return wrapper

