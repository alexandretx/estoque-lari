const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// Proteger todas as rotas do dashboard
router.use(protect);

// Rota para obter estatísticas
// GET /api/dashboard/stats
router.get('/stats', getStats);

module.exports = router; 