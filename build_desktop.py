#!/usr/bin/env python3
"""
PhonePe Expense Intelligence — 1-Click Desktop Builder, Packager & Runner
"""
import sys
import subprocess
import argparse
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = ROOT_DIR / "frontend"
BACKEND_DIR = ROOT_DIR / "backend"
DIST_DIR = BACKEND_DIR / "app" / "dist"

def run_command(cmd, cwd=ROOT_DIR):
    """Executes a shell command with real-time streaming output."""
    print(f"\n🚀 Running: {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    result = subprocess.run(cmd, cwd=cwd, shell=True)
    if result.returncode != 0:
        print(f"❌ Command failed with return code {result.returncode}")
        sys.exit(result.returncode)

def build_frontend():
    """Compiles the React frontend using Vite."""
    print("📦 Building production frontend bundle...")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    run_command(f"{npm_cmd} run build", cwd=FRONTEND_DIR)
    print("✅ Frontend build completed successfully.")

def package_standalone_exe():
    """Packages the entire app into a single standalone .exe file via PyInstaller."""
    build_frontend()
    print("\n🔨 Compiling standalone executable via PyInstaller...")

    dist_src = BACKEND_DIR / "app" / "dist"
    sample_data = BACKEND_DIR / "data" / "transactions.txt"
    icon_path = BACKEND_DIR / "app" / "assets" / "phonepe_icon.ico"

    # PyInstaller data separator is ';' on Windows, ':' on Unix
    sep = ";" if sys.platform == "win32" else ":"

    pyinstaller_cmd = [
        sys.executable,
        "-m", "PyInstaller",
        "--noconsole",
        "--onefile",
        "--name", "PhonePeExpenseTracker",
        "--clean",
        "--collect-all", "webview",
        f"--add-data", f"{dist_src}{sep}dist",
        f"--add-data", f"{sample_data}{sep}data",
    ]

    if icon_path.exists():
        pyinstaller_cmd.extend(["--icon", str(icon_path)])

    pyinstaller_cmd.append(str(BACKEND_DIR / "desktop_main.py"))

    run_command(" ".join(pyinstaller_cmd))
    print("\n🎉 SUCCESS! Standalone single executable created:")
    exe_path = ROOT_DIR / "dist" / "PhonePeExpenseTracker.exe"
    print(f"👉 File location: {exe_path}")
    print("You can copy this single .exe file to any Windows computer and double-click to run!")

def run_desktop(dev_mode=False):
    """Launches the PyWebView desktop application directly."""
    print("🖥️  Launching PhonePe Expense Intelligence Desktop...")
    python_cmd = sys.executable
    script_path = BACKEND_DIR / "desktop_main.py"
    cmd = [python_cmd, str(script_path)]
    if dev_mode:
        cmd.append("--dev")
    run_command(" ".join(cmd))

def main():
    parser = argparse.ArgumentParser(description="PhonePe Expense Intelligence Desktop Manager")
    parser.add_argument("--package", action="store_true", help="Compile standalone single .exe file for distribution")
    parser.add_argument("--build-only", action="store_true", help="Only build frontend, do not launch")
    parser.add_argument("--dev", action="store_true", help="Launch in Vite development mode")
    parser.add_argument("--skip-build", action="store_true", help="Skip frontend build step")
    args = parser.parse_args()

    if args.package:
        package_standalone_exe()
        return

    if not args.skip_build and not args.dev:
        build_frontend()

    if not args.build_only:
        run_desktop(dev_mode=args.dev)

if __name__ == "__main__":
    main()
