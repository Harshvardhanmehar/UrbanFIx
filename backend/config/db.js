// config/db.js - MySQL Database Connection Pool
const mysql = require('mysql2/promise');
require('dotenv').config();

// ── Diagnostics (safe — never logs actual passwords) ─────────────────────────
console.log('🔍 DB Config Check:');
console.log('   DATABASE_URL :', process.env.DATABASE_URL ? '✅ set' : '❌ missing');
console.log('   DB_HOST      :', process.env.DB_HOST      || '❌ missing (will use localhost)');
console.log('   DB_USER      :', process.env.DB_USER      || '❌ missing (will use root)');
console.log('   DB_PASSWORD  :', process.env.DB_PASSWORD  ? '✅ set' : '❌ missing');
console.log('   DB_NAME      :', process.env.DB_NAME      || '❌ missing (will use urbanserve)');

// Support both individual env vars AND a single DATABASE_URL connection string
// (Railway, PlanetScale, and many managed DB providers supply DATABASE_URL)
let poolConfig;

if (process.env.DATABASE_URL) {
  poolConfig = {
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+00:00',
  };
} else {
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'urbanserve',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+00:00',
  };
}

const pool = mysql.createPool(poolConfig);

// Test the connection — NEVER crash the process so Render keeps the server alive
const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    conn.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('   ⚠️  Server will keep running but DB-dependent routes will fail.');
    console.error('   👉  Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (or DATABASE_URL) in Render → Environment.');
    // DO NOT call process.exit() — let the server stay up so Render can show logs
  }
};

testConnection();

module.exports = pool;

