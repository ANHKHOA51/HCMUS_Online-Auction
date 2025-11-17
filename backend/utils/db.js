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
    },
    pool: { min: 0, max: 10 }
});

try {
    await db.raw('SELECT 1');
    console.log('✓ DB connected successfully');
} catch (error) {
    console.error('✗ DB connection failed:', error.message);
    process.exit(1);
}