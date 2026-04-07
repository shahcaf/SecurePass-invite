const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const initializeDB = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_stats (
                user_id STRING PRIMARY KEY,
                invites INT DEFAULT 0,
                joins INT DEFAULT 0,
                leaves INT DEFAULT 0
            );
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS invitations (
                invited_id STRING PRIMARY KEY,
                inviter_id STRING
            );
        `);
        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        client.release();
    }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initializeDB,
  pool
};
