import Dexie from 'dexie';
import { DEFAULT_SETTINGS, DEFAULT_CATEGORIES, SEED_TRANSACTIONS } from './seedData';

export const db = new Dexie('ExpenseTrackerDB');

// Define database schema
db.version(1).stores({
  settings: 'key',
  categories: '++id, name',
  transactions: '++id, date, category_name, amount, created_at',
});

/**
 * Initializes the database with default settings, categories, and initial October 2026 seed data.
 * Runs idempotently on first application launch.
 */
export async function initializeDatabase() {
  try {
    await db.open();

    // Check settings
    const settingsCount = await db.settings.count();
    if (settingsCount === 0) {
      await db.settings.put(DEFAULT_SETTINGS);
    }

    // Check categories
    const categoriesCount = await db.categories.count();
    if (categoriesCount === 0) {
      await db.categories.bulkAdd(DEFAULT_CATEGORIES);
    }

    // Check transactions
    const transactionsCount = await db.transactions.count();
    if (transactionsCount === 0) {
      await db.transactions.bulkAdd(SEED_TRANSACTIONS);
    }
  } catch (err) {
    console.error('Error initializing ExpenseTrackerDB:', err);
  }
}

/**
 * Resets the entire database back to default seed data
 */
export async function resetDatabaseToSeed() {
  await db.transaction('rw', [db.settings, db.categories, db.transactions], async () => {
    await db.settings.clear();
    await db.categories.clear();
    await db.transactions.clear();

    await db.settings.put(DEFAULT_SETTINGS);
    await db.categories.bulkAdd(DEFAULT_CATEGORIES);
    await db.transactions.bulkAdd(SEED_TRANSACTIONS);
  });
}

/**
 * Clears all user transactions
 */
export async function clearAllTransactions() {
  await db.transactions.clear();
}

/**
 * Completely wipes everything
 */
export async function wipeDatabase() {
  await db.transaction('rw', [db.settings, db.categories, db.transactions], async () => {
    await db.settings.clear();
    await db.categories.clear();
    await db.transactions.clear();
    await db.settings.put(DEFAULT_SETTINGS);
    await db.categories.bulkAdd(DEFAULT_CATEGORIES);
  });
}

/**
 * Exports all data to a clean JSON structure
 */
export async function exportDatabaseToJSON() {
  const settings = await db.settings.toArray();
  const categories = await db.categories.toArray();
  const transactions = await db.transactions.toArray();

  return {
    version: 1,
    appName: 'ExpenseTrackerDB',
    exportedAt: new Date().toISOString(),
    settings,
    categories,
    transactions,
  };
}

/**
 * Imports data from JSON backup
 * @param {Object} data 
 * @param {'replace'|'merge'} mode
 */
export async function importDatabaseFromJSON(data, mode = 'replace') {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid backup file: file content is not a valid JSON object.');
  }

  await db.transaction('rw', [db.settings, db.categories, db.transactions], async () => {
    if (mode === 'replace') {
      await db.settings.clear();
      await db.categories.clear();
      await db.transactions.clear();
    }

    if (Array.isArray(data.settings) && data.settings.length > 0) {
      for (const s of data.settings) {
        await db.settings.put(s);
      }
    }

    if (Array.isArray(data.categories) && data.categories.length > 0) {
      if (mode === 'replace') {
        // Strip original autoincrement IDs to prevent primary key collision if needed, or put them
        for (const cat of data.categories) {
          const { id, ...cleanCat } = cat;
          await db.categories.add(cleanCat);
        }
      } else {
        // Merge mode: add if category name doesn't exist
        for (const cat of data.categories) {
          const existing = await db.categories.where('name').equalsIgnoreCase(cat.name).first();
          if (!existing) {
            const { id, ...cleanCat } = cat;
            await db.categories.add(cleanCat);
          }
        }
      }
    }

    if (Array.isArray(data.transactions) && data.transactions.length > 0) {
      for (const tx of data.transactions) {
        const { id, ...cleanTx } = tx;
        await db.transactions.add({
          date: cleanTx.date || new Date().toISOString().slice(0, 10),
          category_name: cleanTx.category_name || 'Miscellaneous',
          amount: Number(cleanTx.amount) || 0,
          reason: cleanTx.reason || 'Expense',
          created_at: cleanTx.created_at || Date.now(),
        });
      }
    }
  });
}
