require('dotenv').config(); // Load environment variables

const { Pool } = require('pg');

// Build connection configuration
const connectionConfig = {};

if (process.env.DATABASE_URL) {
  // Strip query parameters from connection string to allow ssl object override
  const cleanConnectionString = process.env.DATABASE_URL.split('?')[0];
  connectionConfig.connectionString = cleanConnectionString;
  connectionConfig.ssl = { rejectUnauthorized: false };
} else {
  // Validate database configuration
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    console.error('❌ Database configuration missing in .env file');
    console.error('Please ensure DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME (or DATABASE_URL) are set');
    process.exit(1);
  }

  connectionConfig.host = process.env.DB_HOST;
  connectionConfig.user = process.env.DB_USER;
  connectionConfig.password = process.env.DB_PASSWORD;
  connectionConfig.database = process.env.DB_NAME;
  connectionConfig.port = parseInt(process.env.DB_PORT || '5432', 10);
  
  if (process.env.DB_SSL === 'true') {
    connectionConfig.ssl = { rejectUnauthorized: false };
  }
}

connectionConfig.max = 20;
connectionConfig.idleTimeoutMillis = 30000;
connectionConfig.connectionTimeoutMillis = 15000;

const pool = new Pool(connectionConfig);

// Handle unexpected pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

// Test database connection
const testConnection = async () => {
  try {
    const res = await pool.query('SELECT current_database(), current_user, NOW()');
    const dbName = res.rows[0].current_database;
    const dbUser = res.rows[0].current_user;
    const dbTime = res.rows[0].now;

    console.log('✅ PostgreSQL / Supabase database connected successfully');
    console.log(`🗄️  Database: ${dbName}`);
    console.log(`👤 User: ${dbUser}`);
    console.log(`⏰ Time: ${dbTime}`);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    
    // Provide helpful hints
    if (error.code === '28P01') {
      console.error('\n💡 Hint: Check your DB_USER and DB_PASSWORD in .env file');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Hint: PostgreSQL server might not be running or host/port is incorrect');
    } else if (error.code === '3D000') {
      console.error('\n💡 Hint: Database does not exist. Please run backend/database/schema.sql');
    }
    
    process.exit(1);
  }
};

module.exports = { pool, testConnection };