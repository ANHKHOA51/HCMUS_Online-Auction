import { db } from '../utils/db.js';

async function run() {
  console.log('Creating AutoBids table...');
  try {
    const tableExists = await db.schema.hasTable('auto_bids');
    
    if (!tableExists) {
      await db.schema.createTable('auto_bids', table => {
        table.increments('id').primary();
        table.integer('product_id').unsigned().notNullable().references('id').inTable('products').onDelete('CASCADE');
        table.integer('bidder_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.decimal('max_auto_bid', 15, 2).notNullable().comment('Giá trần tự động (ẩn, không công khai)');
        table.decimal('current_bid_amount', 15, 2).notNullable().comment('Giá bid hiện tại trong hệ thống');
        table.enum('status', ['active', 'exhausted', 'won', 'lost']).defaultTo('active');
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
        
        // Indexes
        table.unique(['product_id', 'bidder_id'], { indexName: 'unique_auto_bid' });
        table.index(['product_id', 'status'], 'idx_product_status');
        table.index(['bidder_id', 'product_id'], 'idx_bidder_product');
      });
      console.log('✓ AutoBids table created successfully.');
    } else {
      console.log('AutoBids table already exists.');
    }

    // Add step_price column to products if it doesn't exist
    const hasStepPrice = await db.schema.hasColumn('products', 'step_price');
    if (!hasStepPrice) {
      await db.schema.table('products', table => {
        table.decimal('step_price', 15, 2).defaultTo(100).comment('Bước nhảy giá');
      });
      console.log('✓ step_price column added to products table.');
    }

  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
