const { pool } = require('../config/database');

// GET PUBLIC PUBLISHED NEWS
const getPublicNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '10', 10);
    const { rows: news } = await pool.query(
      `SELECT n.id, n.title, n.content, n.status, n.created_at, n.updated_at,
              p.full_name AS author_name
       FROM news n
       LEFT JOIN users u ON n.author_id = u.id
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE n.status = 'published'
       ORDER BY n.created_at DESC
       LIMIT $1`,
      [limit]
    );

    res.json({ success: true, news });
  } catch (error) {
    console.error('Fetch public news error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch news' });
  }
};

// GET PUBLIC SINGLE NEWS ITEM
const getPublicNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT n.id, n.title, n.content, n.status, n.created_at, n.updated_at,
              p.full_name AS author_name
       FROM news n
       LEFT JOIN users u ON n.author_id = u.id
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE n.id = $1 AND n.status = 'published'`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    res.json({ success: true, article: rows[0] });
  } catch (error) {
    console.error('Fetch single news error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch article' });
  }
};

module.exports = {
  getPublicNews,
  getPublicNewsById
};
