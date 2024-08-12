// server/routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');
const { getAuthUser } = require('../controllers/authController');
const { ensureAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', ensureAuth, getAuthUser);

module.exports = router;
