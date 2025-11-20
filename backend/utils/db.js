import knex from "knex";

const db_host = process.env.SUPABASE_HOST;
const db_port = process.env.SUPABASE_PORT;
const db_pw = process.env.SUPABASE_PASSWORD;
const db_user = process.env.SUPABASE_USER;

export const db = knex({
    client: 'pg',
    connection: {
        host: db_host,
        port: Number(db_port) || 5432,
        user: db_user,
        database: 'postgres',
        password: db_pw,
        connectionTimeoutMillis: 5000,
    },
    pool: { min: 0, max: 10, acquireTimeoutMillis: 30000, idleTimeoutMillis: 30000 }
});

// Test connection asynchronously with timeout
(async () => {
    try {
        console.log('⏳ Testing database connection...');
        const result = await Promise.race([
            db.raw('SELECT 1'),
            new Promise((_, reject) => setTimeout(() => reject(new Error('DB connection timeout')), 10000))
        ]);
        console.log('✓ DB connected successfully');
    } catch (error) {
        console.error('✗ DB connection failed:', error.message);
        process.exit(1);
    }
})();
