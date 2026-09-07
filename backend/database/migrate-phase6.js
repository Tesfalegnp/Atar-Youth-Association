const { pool } = require('../src/config/database');

async function migratePhase6() {
  console.log('Starting Phase 6 database schema migration...');
  try {
    // 1. Add must_change_password to users table if not exists
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
    `);

    // Ensure existing pre-migrated users (like existing admin) don't get forced to change password
    await pool.query(`
      UPDATE users SET must_change_password = FALSE WHERE created_at < NOW() - INTERVAL '1 hour';
    `);

    // 2. Create password_reset_tokens table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token_hash VARCHAR(255) NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          used_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_hash ON password_reset_tokens(token_hash);
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user ON password_reset_tokens(user_id);
    `);

    console.log('✅ Phase 6 database schema migration completed successfully!');
  } catch (error) {
    console.error('❌ Phase 6 migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migratePhase6();
