// backend/seed-admin.js
const bcrypt = require('bcryptjs');
const { pool } = require('./src/config/database');

const createAdmin = async () => {
  try {
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
      // Ensure password hash is updated to valid hash
      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2',
        [adminHash, adminEmail]
      );
      console.log('✅ Admin account exists and password hash updated');
      process.exit(0);
    }

    // Create admin user
    const userResult = await pool.query(
      `INSERT INTO users (email, phone, password_hash, role, status, is_email_verified, is_phone_verified) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        adminEmail,
        '+211912345678',
        adminHash,
        'admin',
        'active',
        true,
        true
      ]
    );

    const adminId = userResult.rows[0].id;

    // Create admin profile
    await pool.query(
      `INSERT INTO profiles (user_id, full_name, gender, date_of_birth, county, payam, bio) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
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
    console.log('   ⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Admin creation failed:', error.message);
    process.exit(1);
  }
};

// Initialize DB and create admin
require('dotenv').config();
const { testConnection } = require('./src/config/database');

(async () => {
  await testConnection();
  await createAdmin();
})();