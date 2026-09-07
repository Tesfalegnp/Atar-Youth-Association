const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { generateTemporaryPassword } = require('../utils/passwordGenerator');
const { sendAdminPasswordResetEmail } = require('../services/emailService');

// Helper: Resolve Client Base URL
const getClientUrl = () => process.env.CLIENT_URL || process.env.APP_URL || 'http://localhost:3000';

// ========================================
// 1. GET DASHBOARD STATISTICS
// ========================================
const getDashboardStats = async (req, res) => {
  try {
    const [
      userStatsRes,
      countyDistRes,
      issueStatsRes,
      newsStatsRes,
      activityStatsRes,
      recentIssuesRes,
      recentUsersRes
    ] = await Promise.all([
      pool.query(`
        SELECT 
          COUNT(*) AS total_users,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_users,
          SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactive_users,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_users,
          SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) AS suspended_users,
          SUM(CASE WHEN role = 'officer' THEN 1 ELSE 0 END) AS officers,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admins
        FROM users
      `),
      
      pool.query(`
        SELECT county, COUNT(*) AS count 
        FROM profiles 
        GROUP BY county 
        ORDER BY count DESC 
        LIMIT 5
      `),
      
      pool.query(`
        SELECT 
          COUNT(*) AS total_issues,
          SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS new_issues,
          SUM(CASE WHEN status = 'under_review' THEN 1 ELSE 0 END) AS reviewing_issues,
          SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved_issues
        FROM issues
      `),
      
      pool.query(`
        SELECT 
          COUNT(*) AS total_news,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published_news,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft_news
        FROM news
      `),
      
      pool.query(`
        SELECT 
          COUNT(*) AS total_activities,
          SUM(CASE WHEN status = 'ongoing' THEN 1 ELSE 0 END) AS ongoing_activities
        FROM activities
      `),
      
      pool.query(`
        SELECT i.id, i.description, i.location, i.status, i.created_at, 
               it.type_name, p.full_name AS reporter
        FROM issues i
        LEFT JOIN issue_types it ON i.issue_type_id = it.id
        LEFT JOIN profiles p ON i.user_id = p.user_id
        ORDER BY i.created_at DESC
        LIMIT 5
      `),
      
      pool.query(`
        SELECT u.id, u.email, u.phone, u.status, u.role, u.created_at, 
               p.full_name, p.county, p.payam
        FROM users u
        LEFT JOIN profiles p ON u.id = p.user_id
        ORDER BY u.created_at DESC
        LIMIT 5
      `)
    ]);

    res.json({
      success: true,
      stats: {
        users: userStatsRes.rows[0],
        counties: countyDistRes.rows,
        issues: issueStatsRes.rows[0],
        news: newsStatsRes.rows[0],
        activities: activityStatsRes.rows[0],
        recent_issues: recentIssuesRes.rows,
        recent_users: recentUsersRes.rows
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to load dashboard data' });
  }
};

// ========================================
// 2. MEMBER MANAGEMENT: GET ALL USERS (With Filtering & Search)
// ========================================
const getUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;

    let query = `
      SELECT u.id, u.email, u.phone, u.role, u.status, u.must_change_password, u.created_at, u.last_login_at,
             p.full_name, p.gender, p.date_of_birth, p.county, p.payam, p.bio, p.profile_photo_url
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search.trim().toLowerCase()}%`);
      query += ` AND (LOWER(p.full_name) LIKE $${params.length} OR LOWER(u.email) LIKE $${params.length} OR u.phone LIKE $${params.length})`;
    }

    if (role && ['user', 'officer', 'admin'].includes(role)) {
      params.push(role);
      query += ` AND u.role = $${params.length}`;
    }

    if (status && ['active', 'inactive', 'pending', 'suspended'].includes(status)) {
      params.push(status);
      query += ` AND u.status = $${params.length}`;
    }

    query += ` ORDER BY u.created_at DESC`;

    const { rows: users } = await pool.query(query, params);
    
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// ========================================
// 3. UPDATE MEMBER STATUS (active, inactive, pending, suspended)
// ========================================
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    
    if (!['active', 'inactive', 'pending', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    
    await pool.query('UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2', [status, userId]);
    
    // Log action in approval_logs
    await pool.query(
      'INSERT INTO approval_logs (user_id, action, approved_by, notes) VALUES ($1, $2, $3, $4)',
      [userId, `status_${status}`, req.user.id, `Status updated to ${status}`]
    );
    
    res.json({ success: true, message: `Member status updated to ${status} successfully` });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update member status' });
  }
};

// ========================================
// 4. UPDATE MEMBER ROLE (user, officer, admin)
// ========================================
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!['user', 'officer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role value' });
    }

    // Protect self role downgrade if sole admin
    if (parseInt(userId, 10) === req.user.id && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot change your own admin role' });
    }
    
    await pool.query('UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2', [role, userId]);
    
    // Log action in approval_logs
    await pool.query(
      'INSERT INTO approval_logs (user_id, action, approved_by, notes) VALUES ($1, $2, $3, $4)',
      [userId, `role_${role}`, req.user.id, `Role updated to ${role}`]
    );
    
    res.json({ success: true, message: `Member role updated to ${role} successfully` });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, message: 'Failed to update member role' });
  }
};

// ========================================
// 5. ADMIN PASSWORD RESET FOR MEMBER
// ========================================
const adminResetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user details
    const { rows: users } = await pool.query(
      `SELECT u.id, u.email, p.full_name 
       FROM users u 
       LEFT JOIN profiles p ON u.id = p.user_id 
       WHERE u.id = $1`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const user = users[0];

    // Generate Temporary Password
    const { temporaryPassword } = generateTemporaryPassword(user.full_name || 'User');

    // Hash with bcrypt
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const passwordHash = await bcrypt.hash(temporaryPassword, salt);

    // Update user record: set must_change_password = TRUE
    await pool.query(
      `UPDATE users 
       SET password_hash = $1, must_change_password = TRUE, updated_at = NOW() 
       WHERE id = $2`,
      [passwordHash, userId]
    );

    // Audit log
    await pool.query(
      'INSERT INTO approval_logs (user_id, action, approved_by, notes) VALUES ($1, $2, $3, $4)',
      [userId, 'password_reset', req.user.id, 'Admin initiated password reset']
    );

    // Send Notification Email
    sendAdminPasswordResetEmail({
      email: user.email,
      fullName: user.full_name || 'Member',
      temporaryPassword,
      loginUrl: `${getClientUrl()}/login`
    }).catch(err => console.error('Admin password reset email error:', err));

    res.json({
      success: true,
      message: `Password reset successfully for ${user.full_name || user.email}.`,
      temporaryPassword
    });

  } catch (error) {
    console.error('Admin reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset member password' });
  }
};

// ========================================
// 6. ADMIN NEWS MANAGEMENT
// ========================================
const getAdminNews = async (req, res) => {
  try {
    const { rows: news } = await pool.query(
      `SELECT n.id, n.title, n.content, n.status, n.created_at, n.updated_at,
              p.full_name AS author_name
       FROM news n
       LEFT JOIN users u ON n.author_id = u.id
       LEFT JOIN profiles p ON u.id = p.user_id
       ORDER BY n.created_at DESC`
    );

    res.json({ success: true, news });
  } catch (error) {
    console.error('Admin get news error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch news articles' });
  }
};

const createNews = async (req, res) => {
  try {
    const { title, content, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const newsStatus = ['draft', 'published'].includes(status) ? status : 'draft';

    const { rows } = await pool.query(
      `INSERT INTO news (title, content, status, author_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title.trim(), content.trim(), newsStatus, req.user.id]
    );

    res.status(201).json({
      success: true,
      message: `News article ${newsStatus === 'published' ? 'published' : 'saved as draft'} successfully`,
      news: rows[0]
    });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ success: false, message: 'Failed to create news article' });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const newsStatus = ['draft', 'published'].includes(status) ? status : 'draft';

    const { rows } = await pool.query(
      `UPDATE news 
       SET title = $1, content = $2, status = $3, updated_at = NOW() 
       WHERE id = $4 RETURNING *`,
      [title.trim(), content.trim(), newsStatus, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    res.json({
      success: true,
      message: 'News article updated successfully',
      news: rows[0]
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ success: false, message: 'Failed to update news article' });
  }
};

const togglePublishNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const { rows } = await pool.query(
      `UPDATE news SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    res.json({
      success: true,
      message: `News article ${status === 'published' ? 'published' : 'unpublished'} successfully`,
      news: rows[0]
    });
  } catch (error) {
    console.error('Toggle news status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update news publication status' });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(`DELETE FROM news WHERE id = $1 RETURNING id`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    res.json({ success: true, message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete news article' });
  }
};

module.exports = { 
  getDashboardStats, 
  getUsers, 
  updateUserStatus,
  updateUserRole,
  adminResetUserPassword,
  getAdminNews,
  createNews,
  updateNews,
  togglePublishNews,
  deleteNews
};