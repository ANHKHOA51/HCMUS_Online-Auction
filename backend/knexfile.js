// knexfile.js
import dotenv from 'dotenv';
dotenv.config();

const db_host = process.env.SUPABASE_HOST;
const db_port = process.env.SUPABASE_PORT;
const db_pw = process.env.SUPABASE_PASSWORD;
const db_user = process.env.SUPABASE_USER;

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'pg',
    connection: {
        host: db_host,
        port: Number(db_port) || 5432,
        user: db_user,
        database: 'postgres',
        password: db_pw,
        connectionTimeoutMillis: 5000,
    },
    pool: { 
        min: 0, 
        max: 10, 
        acquireTimeoutMillis: 30000, 
        idleTimeoutMillis: 30000 
    },
  }
};
