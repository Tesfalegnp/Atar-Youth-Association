const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/adminAuth');
const { 
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
} = require('../controllers/adminController');

// All admin routes require admin authentication
router.use(isAdmin);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Member Management
router.get('/users', getUsers);
router.put('/users/:userId/status', updateUserStatus);
router.put('/users/:userId/role', updateUserRole);
router.post('/users/:userId/reset-password', adminResetUserPassword);

// News Management
router.get('/news', getAdminNews);
router.post('/news', createNews);
router.put('/news/:id', updateNews);
router.patch('/news/:id/status', togglePublishNews);
router.delete('/news/:id', deleteNews);

// Placeholders for activities & issues
router.get('/issues', (req, res) => res.json({ success: true, message: 'Issues endpoint ready' }));
router.get('/activities', (req, res) => res.json({ success: true, message: 'Activities endpoint ready' }));

module.exports = router;