import sys
import argparse
from pathlib import Path
import webview

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.app.api.bridge import DesktopBridgeAPI
from backend.app.utils.logger import setup_logger

def get_entry_url(is_dev: bool) -> str:
    """Determine the web URL or local HTML path to load."""
    if is_dev:
        return "http://localhost:5173"

    # PyInstaller frozen mode
    if getattr(sys, "frozen", False):
        bundle_dir = Path(sys._MEIPASS)
        paths_to_check = [
            bundle_dir / "dist" / "index.html",
            bundle_dir / "backend" / "app" / "dist" / "index.html",
            bundle_dir / "app" / "dist" / "index.html",
        ]
        for p in paths_to_check:
            if p.exists():
                return str(p)

    # Production dev/local: check backend/app/dist or frontend/dist
    backend_dist = Path(__file__).resolve().parent / "app" / "dist" / "index.html"
    frontend_dist = root_dir / "frontend" / "dist" / "index.html"

    if backend_dist.exists():
        return str(backend_dist)
    if frontend_dist.exists():
        return str(frontend_dist)

    # Fallback to dev server if production build not found
    return "http://localhost:5173"

def main():
    parser = argparse.ArgumentParser(description="PhonePe Expense Intelligence Desktop App")
    parser.add_argument("--dev", action="store_true", help="Connect to Vite development server (localhost:5173)")
    args = parser.parse_args()

    logger = setup_logger()
    logger.info("Starting PhonePe Expense Intelligence Desktop Host...")

    api = DesktopBridgeAPI()
    url = get_entry_url(args.dev)

    logger.info(f"Target UI URL: {url}")

    window = webview.create_window(
        title="PhonePe Expense Intelligence",
        url=url,
        js_api=api,
        width=1280,
        height=850,
        min_size=(1024, 680),
        background_color="#0b0f17"
    )

    webview.start(debug=args.dev)

if __name__ == "__main__":
    main()
