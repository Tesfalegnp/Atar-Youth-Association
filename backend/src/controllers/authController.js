const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/database');
const { upload, handleUploadError } = require('../middleware/upload');
const { optimizeImage, cleanupOldImages } = require('../utils/imageOptimizer');
const { generateTemporaryPassword } = require('../utils/passwordGenerator');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');
require('dotenv').config();

// Helper: Resolve Client Base URL
const getClientUrl = () => process.env.CLIENT_URL || process.env.APP_URL || 'http://localhost:3000';

// ========================================
// PROFILE FETCH
// ========================================
const getProfile = async (req, res) => {
  try {
    const { rows: userRows } = await pool.query(
      `SELECT u.id, u.email, u.role, u.phone, u.status, u.must_change_password,
              p.full_name, p.gender, p.date_of_birth, p.county, p.payam, 
              p.bio, p.profile_photo_url
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = userRows[0];
    const firstName = user.full_name ? user.full_name.split(' ')[0] : 'User';
    const photoUrl = user.profile_photo_url 
      ? (user.profile_photo_url.startsWith('http') ? user.profile_photo_url : `/uploads${user.profile_photo_url}`)
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=0284c7&color=fff&size=150`;

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        mustChangePassword: user.must_change_password || false,
        firstName,
        profile: {
          fullName: user.full_name || 'User',
          gender: user.gender || 'prefer_not_to_say',
          dateOfBirth: user.date_of_birth,
          county: user.county || 'Unknown',
          payam: user.payam || 'Unknown',
          bio: user.bio || '',
          profilePhotoUrl: photoUrl
        }
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

// ========================================
// REGISTER (Without Password Prompt)
// ========================================
const registerUser = async (req, res) => {
  try {
    const { email, phone, full_name, gender, date_of_birth, county, payam } = req.body;

    if (!email || !phone || !full_name || !gender || !date_of_birth || !county || !payam) {
      return res.status(400).json({ success: false, message: 'All registration fields are required' });
    }

    // South Sudan phone format check (+211XXXXXXXXX)
    if (!/^\+211\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid South Sudan phone format (+211XXXXXXXXX)' });
    }

    // Check existing account
    const { rows: existing } = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2',
      [email, phone]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email or phone number is already registered' });
    }

    // Generate Temporary Password (MiddleName + A123)
    const { temporaryPassword } = generateTemporaryPassword(full_name);

    // Hash temporary password
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const passwordHash = await bcrypt.hash(temporaryPassword, salt);

    // Insert user with must_change_password = TRUE
    const userResult = await pool.query(
      `INSERT INTO users (email, phone, password_hash, role, status, must_change_password, is_email_verified) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [email.trim().toLowerCase(), phone.trim(), passwordHash, 'user', 'active', true, true]
    );

    const userId = userResult.rows[0].id;

    // Insert profile
    await pool.query(
      'INSERT INTO profiles (user_id, full_name, gender, date_of_birth, county, payam) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, full_name.trim(), gender, date_of_birth, county.trim(), payam.trim()]
    );

    // Dispatch Welcome Email asynchronously
    sendWelcomeEmail({
      email: email.trim().toLowerCase(),
      fullName: full_name.trim(),
      temporaryPassword,
      loginUrl: `${getClientUrl()}/login`
    }).catch(err => console.error('Failed to send registration email:', err));

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful! Your login credentials have been sent to your email address.',
      redirect: '/login'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

// ========================================
// LOGIN
// ========================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email/Phone and password are required' });
    }

    const cleanInput = email.trim();

    // Find user by email or phone
    const { rows: users } = await pool.query(
      `SELECT u.id, u.email, u.phone, u.password_hash, u.role, u.status, u.must_change_password,
              p.full_name, p.profile_photo_url
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.email = $1 OR u.phone = $2`,
      [cleanInput.toLowerCase(), cleanInput]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check account status
    if (user.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        message: `Account is currently ${user.status}. Please contact an administrator.` 
      });
    }

    // Verify bcrypt password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT payload including must_change_password
    const jwtSecret = process.env.JWT_SECRET || 'atar_youth_association_jwt_secret_key_2026';
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        must_change_password: user.must_change_password || false
      },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Update last login timestamp
    try {
      await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
    } catch (dbErr) {
      console.warn('Could not update last_login_at:', dbErr.message);
    }

    const firstName = user.full_name ? user.full_name.split(' ')[0] : 'User';
    const photoUrl = user.profile_photo_url 
      ? (user.profile_photo_url.startsWith('http') ? user.profile_photo_url : `/uploads${user.profile_photo_url}`)
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=0284c7&color=fff&size=150`;

    res.json({ 
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        mustChangePassword: user.must_change_password || false,
        firstName,
        profilePhotoUrl: photoUrl
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', details: error.message });
  }
};

// ========================================
// CHANGE / UPDATE PASSWORD (First Login & Settings)
// ========================================
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password and new password are required' 
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password and confirmation do not match' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password must be at least 6 characters long' 
      });
    }

    // Fetch user hash
    const { rows: users } = await pool.query(
      'SELECT email, role, password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = users[0];

    // Verify current/temporary password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Current/temporary password is incorrect' 
      });
    }

    // Prevent new password being identical to current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
    if (isSamePassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password must be different from your current/temporary password' 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Update database: must_change_password = FALSE
    await pool.query(
      `UPDATE users 
       SET password_hash = $1, must_change_password = FALSE, password_changed_at = NOW(), updated_at = NOW() 
       WHERE id = $2`,
      [newPasswordHash, userId]
    );

    // Generate fresh JWT token with must_change_password = false
    const freshToken = jwt.sign(
      { 
        id: userId, 
        email: user.email, 
        role: user.role,
        must_change_password: false
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({ 
      success: true, 
      message: 'Password updated successfully!',
      token: freshToken,
      mustChangePassword: false
    });

  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update password' });
  }
};

// ========================================
// FORGOT PASSWORD REQUEST
// ========================================
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Standard non-enumerating success response
    const genericResponse = {
      success: true,
      message: 'If an account matches the email provided, password reset instructions have been sent.'
    };

    // Find user
    const { rows: users } = await pool.query(
      `SELECT u.id, u.email, p.full_name 
       FROM users u 
       LEFT JOIN profiles p ON u.id = p.user_id 
       WHERE u.email = $1 AND u.status = 'active'`,
      [cleanEmail]
    );

    if (users.length === 0) {
      return res.json(genericResponse);
    }

    const user = users[0];

    // Generate cryptographically secure random token (32 bytes = 64 hex chars)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token with SHA-256 for database storage
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Invalidate existing reset tokens for this user
    await pool.query(
      `UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL`,
      [user.id]
    );

    // Store token hash in database
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    );

    // Send Password Reset Email
    const resetUrl = `${getClientUrl()}/reset-password?token=${resetToken}`;
    sendPasswordResetEmail({
      email: user.email,
      fullName: user.full_name || 'Member',
      resetUrl,
      expiresMinutes: 60
    }).catch(err => console.error('Reset email error:', err));

    res.json(genericResponse);

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ success: false, message: 'Failed to process password reset request' });
  }
};

// ========================================
// RESET PASSWORD (WITH TOKEN)
// ========================================
const resetPasswordWithToken = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New password and confirmation do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    // Hash incoming token to match stored hash
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Query active reset token
    const { rows: tokenRows } = await pool.query(
      `SELECT id, user_id FROM password_reset_tokens 
       WHERE token_hash = $1 AND expires_at > NOW() AND used_at IS NULL`,
      [tokenHash]
    );

    if (tokenRows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired password reset token. Please request a new one.' 
      });
    }

    const resetRecord = tokenRows[0];
    const userId = resetRecord.user_id;

    // Hash new password
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Update user password and set must_change_password = FALSE
    await pool.query(
      `UPDATE users 
       SET password_hash = $1, must_change_password = FALSE, password_changed_at = NOW(), updated_at = NOW() 
       WHERE id = $2`,
      [newPasswordHash, userId]
    );

    // Mark token as used
    await pool.query(
      `UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1`,
      [resetRecord.id]
    );

    res.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
      redirect: '/login'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};

// ========================================
// UPDATE PROFILE
// ========================================
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      full_name, gender, date_of_birth, county, payam, bio,
      phone, email 
    } = req.body;

    if (!full_name || !gender || !date_of_birth || !county || !payam) {
      return res.status(400).json({ success: false, message: 'Missing required profile fields' });
    }

    if (phone && !/^\+211\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid South Sudan phone format (+211XXXXXXXXX)' });
    }

    // Handle photo upload
    let photoUrls = null;
    if (req.file) {
      try {
        const { rows: currentProfile } = await pool.query(
          'SELECT profile_photo_url FROM profiles WHERE user_id = $1',
          [userId]
        );
        
        photoUrls = await optimizeImage(req.file.path, userId);
        
        if (currentProfile[0]?.profile_photo_url && !currentProfile[0].profile_photo_url.startsWith('http')) {
          await cleanupOldImages(currentProfile[0].profile_photo_url);
        }
      } catch (err) {
        console.warn('Profile photo update skipped due to image processing error:', err.message);
      }
    }

    // Update users table (contact info)
    if (phone || email) {
      const updates = [];
      const values = [];
      let paramIdx = 1;
      
      if (phone) {
        updates.push(`phone = $${paramIdx++}`);
        values.push(phone);
      }
      if (email) {
        updates.push(`email = $${paramIdx++}`);
        values.push(email.trim().toLowerCase());
      }
      
      if (updates.length > 0) {
        values.push(userId);
        await pool.query(
          `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIdx}`,
          values
        );
      }
    }

    // Update profiles table
    const setClauses = [
      'full_name = $1',
      'gender = $2',
      'date_of_birth = $3',
      'county = $4',
      'payam = $5',
      'bio = $6',
      'updated_at = NOW()'
    ];
    const setParams = [
      full_name.trim(),
      gender,
      date_of_birth,
      county.trim(),
      payam.trim(),
      bio ? bio.trim() : null
    ];

    if (photoUrls?.originalUrl) {
      setClauses.push(`profile_photo_url = $${setParams.length + 1}`);
      setParams.push(photoUrls.originalUrl);
    }

    setParams.push(userId);
    await pool.query(
      `UPDATE profiles SET ${setClauses.join(', ')} WHERE user_id = $${setParams.length}`,
      setParams
    );

    // Fetch updated user profile
    const { rows: updated } = await pool.query(
      `SELECT u.id, u.email, u.phone, u.role, u.must_change_password,
              p.full_name, p.gender, p.date_of_birth, p.county, p.payam, 
              p.bio, p.profile_photo_url
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId]
    );

    const user = updated[0];
    const firstName = user.full_name.split(' ')[0];
    const finalPhotoUrl = user.profile_photo_url 
      ? (user.profile_photo_url.startsWith('http') ? user.profile_photo_url : `/uploads${user.profile_photo_url}`)
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=0ea5e9&color=fff&size=150`;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        mustChangePassword: user.must_change_password || false,
        firstName,
        profile: {
          fullName: user.full_name,
          gender: user.gender,
          dateOfBirth: user.date_of_birth,
          county: user.county,
          payam: user.payam,
          bio: user.bio || '',
          profilePhotoUrl: finalPhotoUrl
        }
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// ========================================
// EXPORTS
// ========================================
module.exports = { 
  registerUser, 
  loginUser, 
  getProfile, 
  updateProfile, 
  updatePassword,
  requestPasswordReset,
  resetPasswordWithToken,
  upload, 
  handleUploadError 
};