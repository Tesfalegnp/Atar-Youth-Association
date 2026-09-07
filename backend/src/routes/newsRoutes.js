const express = require('express');
const router = express.Router();
const { getPublicNews, getPublicNewsById } = require('../controllers/newsController');

// Public News Routes
router.get('/', getPublicNews);
router.get('/:id', getPublicNewsById);

module.exports = router;
