# VaultTrack — Browser-Native Expense & Budget Tracker

A high-performance, 100% client-side single-page web application (SPA) built for zero-backend deployment on **Cloudflare Pages**. All data is persisted directly in the user's browser using **IndexedDB** via **Dexie.js**, guaranteeing complete privacy, offline resilience, and instant sub-millisecond query reactivity.

---

## 🚀 Key Features

- **Zero-Backend Architecture:** No server or cloud database required. Runs 100% client-side with IndexedDB.
- **Instant 3-Second Debit Logging:** Auto-focused numeric keypad on mobile (`inputmode="decimal"`), quick category pills, and frequent payee suggestions.
- **Summary Dashboard:**
  - **Opening Balance Card:** Inline live editable monthly budget (default ₹36,000 for October 2026).
  - **Total Spent Card:** Real-time reactive sum of debits.
  - **Net Remaining Balance Card:** Color-coded financial health indicator (Green >20%, Amber ≤20%, Red overdrawn).
  - **Dedicated Bike Cap Meter:** Specialized progress bar for *Bike / Fuel* (₹1,203 / ₹3,000 spent, ₹1,797 remaining).
- **Category Health Meters:** Visual progress bars with active "Within Limit" and pulsating "Over Budget" badges.
- **Interactive SVG Spending Donut:** Visual distribution of spending by category with hover tooltips and percentage shares.
- **Chronological Transaction Ledger:**
  - Full-text search across payees, merchants, and amounts.
  - Category and date filters with instant subtotal calculation.
  - Quick delete with undo toast and full inline edit modal.
- **Data Portability & Backup:**
  - **1-Click JSON Backup:** Download complete snapshot (`expenses-backup.json`).
  - **JSON Restore:** Restore with Replace or Merge modes and file validation.
  - **1-Click CSV Export:** Export ledger formatted for Excel and Google Sheets with UTF-8 BOM.
  - **Seed Reset:** Instant reset back to October 2026 default seed transactions.
- **Modern Theme:** Seamless Dark and Light mode toggle with local persistence.

---

## 🗄️ Database Schema (`ExpenseTrackerDB`)

### 1. `settings` Store
| Field | Type | Description |
|---|---|---|
| `key` | `string` (Primary Key) | e.g. `'monthly_config'` |
| `opening_balance` | `number` | Default: `36000` |
| `currency_symbol` | `string` | Default: `'₹'` |
| `month_year` | `string` | e.g. `'2026-10'` |

### 2. `categories` Store
| Field | Type | Description |
|---|---|---|
| `id` | `number` (Auto-increment) | Primary Key (`++id`) |
| `name` | `string` | e.g., `'Bike / Fuel'`, `'Food & Dining'`, `'Groceries'` |
| `monthly_limit` | `number` | Monthly budget cap (e.g. 3000, 6000, 4000) |
| `color` | `string` | Hex color code |
| `icon` | `string` | Lucide icon identifier |

### 3. `transactions` Store
| Field | Type | Description |
|---|---|---|
| `id` | `number` (Auto-increment) | Primary Key (`++id`) |
| `date` | `string` (Indexed) | ISO Date: `YYYY-MM-DD` |
| `category_name` | `string` (Indexed) | Associated category name |
| `amount` | `number` (Indexed) | Debit amount |
| `reason` | `string` | Merchant or description |
| `created_at` | `number` (Timestamp) | Unix timestamp in milliseconds |

---

## 📦 Local Development

```bash
# 1. Navigate to project directory
cd expense-tracker

# 2. Install dependencies (if not already installed)
npm install

# 3. Start local development server
npm run dev

# 4. Create production build
npm run build

# 5. Preview production build locally
npm run preview
```

The production assets will be built to the `dist/` directory.

---

## 🌐 Cloudflare Pages Deployment Instructions

### Method 1: Instant Deployment via Wrangler CLI (Fastest)

You can deploy the pre-built `dist/` directory directly to Cloudflare Pages from your terminal:

1. **Login to Cloudflare** (one-time setup):
   ```bash
   npx wrangler login
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   npx wrangler pages deploy dist --project-name=vaulttrack-expenses
   ```

3. When prompted:
   - Select your Cloudflare account.
   - Cloudflare will upload the static assets and provide a live `*.pages.dev` URL (e.g. `https://vaulttrack-expenses.pages.dev`).

---

### Method 2: Git Repository Integration (CI/CD)

1. Push this project to GitHub, GitLab, or Bitbucket.
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository and configure the build settings:
   - **Project Name:** `vaulttrack` (or your choice)
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Build Output Directory:** `dist`
   - **Environment Variables (Optional):**
     - `NODE_VERSION`: `20` or `22`
4. Click **Save and Deploy**. Cloudflare Pages will automatically build and publish your site on every push!

---

## 🔒 Security & Offline Resilience

- Contains a pre-configured `_headers` file with strict Content Security Headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).
- Fully operable offline without network connectivity thanks to local IndexedDB storage.
