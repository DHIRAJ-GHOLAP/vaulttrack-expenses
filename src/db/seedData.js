export const DEFAULT_SETTINGS = {
  key: 'monthly_config',
  opening_balance: 36000,
  currency_symbol: '₹',
  month_year: '2026-10',
};

export const DEFAULT_CATEGORIES = [
  {
    name: 'Bike / Fuel',
    monthly_limit: 3000,
    color: '#f97316', // Orange
    icon: 'Fuel',
  },
  {
    name: 'Food & Dining',
    monthly_limit: 6000,
    color: '#ef4444', // Red
    icon: 'Utensils',
  },
  {
    name: 'Groceries',
    monthly_limit: 4000,
    color: '#10b981', // Emerald
    icon: 'ShoppingCart',
  },
  {
    name: 'Bills & Utilities',
    monthly_limit: 5000,
    color: '#3b82f6', // Blue
    icon: 'Receipt',
  },
  {
    name: 'Cash Withdrawal',
    monthly_limit: 8000,
    color: '#8b5cf6', // Purple
    icon: 'Banknote',
  },
  {
    name: 'Personal Care',
    monthly_limit: 2000,
    color: '#ec4899', // Pink
    icon: 'Sparkles',
  },
  {
    name: 'Miscellaneous',
    monthly_limit: 2000,
    color: '#64748b', // Slate
    icon: 'Layers',
  },
];

export const SEED_TRANSACTIONS = [
  // 01-Oct
  {
    date: '2026-10-01',
    category_name: 'Miscellaneous',
    amount: 12,
    reason: 'Rahul Balu Uttarde',
    created_at: new Date('2026-10-01T09:15:00Z').getTime(),
  },
  {
    date: '2026-10-01',
    category_name: 'Food & Dining',
    amount: 20,
    reason: 'Sandeep Ramnarayan',
    created_at: new Date('2026-10-01T13:30:00Z').getTime(),
  },
  {
    date: '2026-10-01',
    category_name: 'Food & Dining',
    amount: 20,
    reason: 'Ramnarayan Hanumandas',
    created_at: new Date('2026-10-01T17:45:00Z').getTime(),
  },
  // 02-Oct
  {
    date: '2026-10-02',
    category_name: 'Bike / Fuel',
    amount: 903,
    reason: 'JSP Petroleum',
    created_at: new Date('2026-10-02T08:20:00Z').getTime(),
  },
  {
    date: '2026-10-02',
    category_name: 'Miscellaneous',
    amount: 1,
    reason: 'One Percent Club',
    created_at: new Date('2026-10-02T10:00:00Z').getTime(),
  },
  {
    date: '2026-10-02',
    category_name: 'Bills & Utilities',
    amount: 749,
    reason: 'MYJIO',
    created_at: new Date('2026-10-02T11:15:00Z').getTime(),
  },
  {
    date: '2026-10-02',
    category_name: 'Groceries',
    amount: 137,
    reason: 'BLINKIT',
    created_at: new Date('2026-10-02T14:30:00Z').getTime(),
  },
  {
    date: '2026-10-02',
    category_name: 'Food & Dining',
    amount: 208,
    reason: 'Avenue Food Plaza',
    created_at: new Date('2026-10-02T19:00:00Z').getTime(),
  },
  {
    date: '2026-10-02',
    category_name: 'Food & Dining',
    amount: 354,
    reason: 'Motoshry',
    created_at: new Date('2026-10-02T21:10:00Z').getTime(),
  },
  {
    date: '2026-10-02',
    category_name: 'Cash Withdrawal',
    amount: 5000,
    reason: 'HDFC ATM',
    created_at: new Date('2026-10-02T21:30:00Z').getTime(),
  },
  // 03-Oct
  {
    date: '2026-10-03',
    category_name: 'Food & Dining',
    amount: 342,
    reason: 'Motoshry',
    created_at: new Date('2026-10-03T11:00:00Z').getTime(),
  },
  {
    date: '2026-10-03',
    category_name: 'Personal Care',
    amount: 200,
    reason: 'Perfect Mens Salon',
    created_at: new Date('2026-10-03T12:30:00Z').getTime(),
  },
  {
    date: '2026-10-03',
    category_name: 'Miscellaneous',
    amount: 40,
    reason: 'Sujal Enterprises',
    created_at: new Date('2026-10-03T14:15:00Z').getTime(),
  },
  {
    date: '2026-10-03',
    category_name: 'Food & Dining',
    amount: 80,
    reason: 'Manpasand Panipuri',
    created_at: new Date('2026-10-03T16:20:00Z').getTime(),
  },
  {
    date: '2026-10-03',
    category_name: 'Miscellaneous',
    amount: 10,
    reason: 'Badar Ram',
    created_at: new Date('2026-10-03T17:05:00Z').getTime(),
  },
  {
    date: '2026-10-03',
    category_name: 'Bike / Fuel',
    amount: 300,
    reason: 'Farhan Washing Center',
    created_at: new Date('2026-10-03T18:10:00Z').getTime(),
  },
  {
    date: '2026-10-03',
    category_name: 'Miscellaneous',
    amount: 64,
    reason: 'Satish Janardhan',
    created_at: new Date('2026-10-03T19:40:00Z').getTime(),
  },
];
