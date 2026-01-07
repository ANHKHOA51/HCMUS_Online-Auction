import { db } from '../utils/db.js';

async function run() {
  console.log('Adding is_auto_bid column to bids table...');
  try {
    const hasColumn = await db.schema.hasColumn('bids', 'is_auto_bid');
    if (!hasColumn) {
      await db.schema.table('bids', table => {
        table.boolean('is_auto_bid').defaultTo(false);
      });
      console.log('Column is_auto_bid added successfully.');
    } else {
      console.log('Column is_auto_bid already exists.');
    }
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit();
  }
}

run();
