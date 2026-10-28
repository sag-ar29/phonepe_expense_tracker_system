# 🟣 PhonePe Expense Intelligence — Desktop & CLI Application

An industry-grade, high-performance desktop and CLI application for analyzing **PhonePe** expense statements with interactive charts, monthly budget tracking, smart insights, statement health diagnostics, and a searchable transaction ledger.

Built with **PyWebView + React 18 + Vite + Tailwind CSS + Recharts**.

---

## 🌟 Key Features

* **Drag-and-Drop Statement Upload**: Drop your `transactions.txt` or CSV statement directly onto the application window for instant parsing.
* **Smart Merchant Categorizer**: Automatically classifies merchants into **Shopping, Bills, Food, Travel, Health, Entertainment, and Other**.
* **Statement Health Inspector**: Detects and isolates malformed lines (e.g. Line 9: missing amount) with detailed error reasons and in-place correction.
* **Real-time Budget Velocity & Overrun Alerts**: Visual radial progress and pulsing alert banners when monthly budget thresholds are exceeded.
* **Interactive Data Visualizations**:
  * **Category Breakdown Donut Chart**: Hover tooltips, percentage indicators, and center spend summary.
  * **Daily Velocity Timeline Bar Chart**: Day-by-day expenditure trends with automated peak spend day detection.
* **Searchable & Sortable Ledger**: Filter transactions by category, search by merchant/date, and sort columns with pagination.
* **Native Desktop Capabilities**:
  * Native Windows File Explorer open/save dialogs.
  * 100% Offline execution — user financial statements never leave the machine.
  * Export analysis reports to **CSV** or **JSON**.
  * Dynamic budget configuration modal with persistence in `user_config.json`.

---

## 🖥️ UI Dashboard Preview

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 🟣 PhonePe Expense Intelligence          [⚡ Load Demo Data]  [📥 Upload Statement] [⚙️]│
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  ⚠️ BUDGET OVERRUN ALERT                                                                 │
│  You've spent ₹15,346.00, exceeding your ₹10,000.00 monthly limit by ₹5,346.00 (153.5%) │
├──────────────────────────┬──────────────────────────┬───────────────────────────────────┤
│ 💳 Total Spent           │ 🛍️ Top Category          │ 📊 Daily Velocity                 │
│ ₹15,346.00               │ Shopping (₹5,738 · 37.4%)│ ₹639.42 / day (24 active days)    │
├──────────────────────────┴──────────────────────────┴───────────────────────────────────┤
│ ⚠️ Statement Health: 24 valid transactions parsed · 1 skipped line [Click to inspect]    │
│    └─ Line #9: "2026-08-09, Invalid Line Without Comma" (Missing required fields)       │
├──────────────────────────────────────────┬──────────────────────────────────────────────┤
│ Category Spend Distribution (Donut)      │ Daily Spending Trends (Interactive Bar)      │
│         🍩 Shopping:  ₹5,738 (37.4%)     │   ₹1850 █ (Aug 13: Bescom)                   │
│            Bills:     ₹3,608 (23.5%)     │   ₹1750 █ (Aug 17: Myntra)                   │
│            Food:      ₹2,480 (16.2%)     │   ₹1450 █ (Aug 03: DMart)                    │
│            Travel:    ₹2,320 (15.1%)     │   ₹1299 █                                    │
│            Health:    ₹1,200 ( 7.8%)     │         █ █ █ █ █ █ █ █ █ █                  │
├──────────────────────────────────────────┴──────────────────────────────────────────────┤
│ 📋 Transaction Ledger  [🔍 Search merchant...] [All Categories ▼] [Sort: Highest ▼] [⬇️]│
│ Date         Merchant                 Category      Amount       Status                 │
│ 2026-08-13   Electricity Bill Bescom  ⚡ Bills      ₹1,850.00    Verified               │
│ 2026-08-17   Myntra Fashion Shopping  🛍️ Shopping   ₹1,750.00    Verified               │
│ 2026-08-03   DMart Supermarket        🛍️ Shopping   ₹1,450.00    Verified               │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Decoupled Architecture & Folder Structure

```text
phonepe_expense_tracker_system/
│
├── backend/                             # 🐍 PYTHON DESKTOP CORE & DOMAIN LOGIC
│   ├── app/
│   │   ├── api/
│   │   │   └── bridge.py                # IPC Bridge: Exposes Python methods to JavaScript
│   │   ├── config/
│   │   │   └── settings.py              # Budget limits, app constants, file paths
│   │   ├── models/
│   │   │   └── expense.py               # Data models (Transaction, ExpenseSummary, SkippedLine)
│   │   ├── services/
│   │   │   ├── categorizer.py           # Merchant categorization
│   │   │   ├── parser.py                # Resilient line parser with error diagnostics
│   │   │   ├── tracker.py               # Spending aggregation & budget velocity engine
│   │   │   └── exporter.py              # CSV and JSON report generator
│   │   └── utils/
│   │       ├── decorators.py            # Execution timer decorators
│   │       ├── file_handler.py          # Local file reading & writing helpers
│   │       └── logger.py                # Structured logging to logs/tracker.log
│   │
│   ├── data/
│   │   ├── transactions.txt             # Default/sample statement file
│   │   ├── summary.json                 # Generated analysis summary
│   │   └── user_config.json             # Persisted settings (budget limit, theme)
│   ├── logs/
│   │   └── tracker.log                  # Desktop application logs
│   ├── tests/
│   │   └── test_tracker.py              # Automated unit test suite
│   ├── desktop_main.py                  # PyWebView desktop window launcher
│   ├── main.py                          # Backward-compatible CLI runner
│   └── requirements.txt                 # Python dependencies (pywebview)
│
├── frontend/                            # ⚛️ MODERN REACT 18 + TYPESCRIPT UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/                  # Titlebar, Header, Container
│   │   │   ├── upload/                  # FileDropzone, HealthModal
│   │   │   ├── dashboard/               # MetricCards, BudgetBanner, CategoryDonut, TimelineChart
│   │   │   ├── ledger/                  # TransactionTable, CategoryBadge
│   │   │   └── settings/                # BudgetModal dialog
│   │   ├── services/
│   │   │   └── desktopBridge.ts         # Strongly-typed client calling window.pywebview.api
│   │   ├── types/
│   │   │   └── index.ts                 # TypeScript interfaces
│   │   ├── utils/
│   │   │   └── formatters.ts            # Currency (INR) and date formatters
│   │   ├── styles/
│   │   │   └── index.css                # Tailwind CSS theme & PhonePe purple variables
│   │   ├── App.tsx                      # Root application component
│   │   └── main.tsx                     # React entrypoint
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts                   # Builds production bundle to backend/app/dist
│
├── build_desktop.py                     # 1-Click build & desktop runner script
├── main.py                              # Root CLI runner (100% backward compatible)
└── README.md
```

---

## 📄 Statement File Format

The system expects comma-separated or tab-separated text statements in the following format:

```text
YYYY-MM-DD, Merchant Name, Amount
```

**Example (`backend/data/transactions.txt`):**
```text
2026-08-01, Swiggy, 350
2026-08-02, Uber Ride, 180
2026-08-03, DMart Supermarket, 1450
2026-08-13, Electricity Bill Bescom, 1850
2026-08-17, Myntra Fashion Shopping, 1750
```

Malformed lines (e.g. missing commas or non-numeric amounts) are automatically caught and flagged by the **Statement Health Inspector** without crashing the app.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
* **Python**: 3.10+ (with virtual environment)
* **Node.js**: v18+ and `npm`

### 2. Run the Desktop Application (1-Click)
```bash
python build_desktop.py
```
This automatically compiles the production frontend bundle and launches the native Windows desktop application.

### 3. Run in Development Mode (Live Hot-Reload)
* In Terminal 1 (Frontend dev server):
  ```bash
  cd frontend
  npm run dev
  ```
* In Terminal 2 (Desktop window):
  ```bash
  python backend/desktop_main.py --dev
  ```

### 4. Run the CLI Application
To generate a text analysis report in the terminal:
```bash
python main.py
```

### 5. Run the Automated Test Suite
To execute the backend test suite:
```bash
.venv\Scripts\python.exe -m unittest backend/tests/test_tracker.py
```

### 6. Package Standalone Single `.exe` File (For Sharing)
To compile a single, portable Windows executable that you can share with anyone:
```bash
python build_desktop.py --package
```
This generates:
```text
dist/PhonePeExpenseTracker.exe  (~13.5 MB)
```
* **No Python, Node.js, or dependencies required** on target machines.
* **100% offline & self-contained**. Simply double-click the `.exe` to run on any Windows 10/11 PC.

---

## 💡 Tech Stack (100% Free & Open Source)

| Component | Technology | License |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript + Vite | MIT |
| **Styling Engine** | Tailwind CSS v4 | MIT |
| **Visualizations** | Recharts | MIT |
| **Icons** | Lucide React | ISC |
| **Desktop Host** | PyWebView + Edge WebView2 | BSD-3-Clause / Native OS |
| **Backend Core** | Python 3.10+ | PSF |
