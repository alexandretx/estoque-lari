const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Rota para registrar um novo usuário
// POST /api/auth/register
router.post('/register', registerUser);

// Rota para logar um usuário
// POST /api/auth/login
router.post('/login', loginUser);

// Rota para obter dados do usuário logado (protegida)
// GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router; 