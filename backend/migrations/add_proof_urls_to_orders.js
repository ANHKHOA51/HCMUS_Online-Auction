
import { db } from '../utils/db.js';

async function runMigration() {
    try {
        console.log('Running add_proof_urls_to_orders migration...');

        // Rename payment_proof → payment_proof_url if needed
        const hasPaymentProofUrl = await db.schema.hasColumn('orders', 'payment_proof_url');
        const hasPaymentProof = await db.schema.hasColumn('orders', 'payment_proof');
        
        if (hasPaymentProof && !hasPaymentProofUrl) {
            await db.schema.table('orders', function (table) {
                table.renameColumn('payment_proof', 'payment_proof_url');
            });
            console.log('✅ Renamed payment_proof → payment_proof_url');
        }

        // Rename shipping_proof → shipping_invoice_url if needed
        const hasShippingInvoiceUrl = await db.schema.hasColumn('orders', 'shipping_invoice_url');
        const hasShippingProof = await db.schema.hasColumn('orders', 'shipping_proof');
        
        if (hasShippingProof && !hasShippingInvoiceUrl) {
            await db.schema.table('orders', function (table) {
                table.renameColumn('shipping_proof', 'shipping_invoice_url');
            });
            console.log('✅ Renamed shipping_proof → shipping_invoice_url');
        }

        // Add payment_method if not exists
        const hasPaymentMethod = await db.schema.hasColumn('orders', 'payment_method');
        if (!hasPaymentMethod) {
            await db.schema.table('orders', function (table) {
                table.string('payment_method').nullable();
            });
            console.log('✅ Added payment_method column');
        }

        // Add note if not exists
        const hasNote = await db.schema.hasColumn('orders', 'note');
        if (!hasNote) {
            await db.schema.table('orders', function (table) {
                table.text('note').nullable();
            });
            console.log('✅ Added note column');
        }

        console.log('Migration completed.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
