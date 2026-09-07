// backend/seed-admin.js
const bcrypt = require('bcryptjs');
const { pool } = require('./src/config/database');

const seedAdmin = async () => {
  try {
    // Ensure Phase 6 columns & tables exist
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
    `);

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
      ALTER TABLE profiles
      ADD COLUMN IF NOT EXISTS profile_photo_url VARCHAR(550),
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
    `);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ataryouth.org';
    const adminPassword = process.env.ADMIN_PASSWORD || '1234';
    
    // Check if admin exists
    const { rows: existing } = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );
    
    // Generate valid bcrypt hash
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const adminHash = await bcrypt.hash(adminPassword, salt);

    if (existing.length > 0) {
      // Ensure password hash & must_change_password status are updated
      await pool.query(
        'UPDATE users SET password_hash = $1, must_change_password = FALSE WHERE email = $2',
        [adminHash, adminEmail]
      );
      console.log('✅ Admin account verified and password hash updated');
      return;
    }

    // Create admin user
    const userResult = await pool.query(
      `INSERT INTO users (email, phone, password_hash, role, status, is_email_verified, is_phone_verified, must_change_password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        adminEmail,
        '+211912345678',
        adminHash,
        'admin',
        'active',
        true,
        true,
        false
      ]
    );

    const adminId = userResult.rows[0].id;

    // Create admin profile
    await pool.query(
      `INSERT INTO profiles (user_id, full_name, gender, date_of_birth, county, payam, bio) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id) DO NOTHING`,
      [
        adminId,
        'System Administrator',
        'male',
        '1990-01-01',
        'Central Equatoria',
        'Juba',
        'Default administrator account for Atar Youth Association'
      ]
    );

    console.log('✅ ADMIN ACCOUNT CREATED SUCCESSFULLY');
    console.log(`   Username: ${adminEmail}`);
  } catch (error) {
    console.warn('⚠️ Admin seeding warning:', error.message);
  }
};

// Run standalone if executed directly via CLI
if (require.main === module) {
  require('dotenv').config();
  const { testConnection } = require('./src/config/database');
  (async () => {
    await testConnection();
    await seedAdmin();
    process.exit(0);
  })();
}

module.exports = { seedAdmin };