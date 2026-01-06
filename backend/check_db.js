import 'dotenv/config';
import { db } from './utils/db.js';

async function checkData() {
    try {
        console.log("Checking tables...");

        const userColumns = await db('users').columnInfo();
        console.log('Users table columns:', Object.keys(userColumns));
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkData();
