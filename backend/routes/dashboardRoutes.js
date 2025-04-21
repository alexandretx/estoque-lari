const express = require('express');
const router = express.Router();
const { getDashboardStats, checkOldItems } = require('../controllers/dashboardController');
const { getRecentActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

// Proteger todas as rotas do dashboard
router.use(protect);

// Rota para obter estatísticas
// GET /api/dashboard/stats
router.get('/stats', getDashboardStats);

// Rota para buscar atividades recentes
// GET /api/dashboard/activities
router.get('/activities', getRecentActivities);

// Rota para verificar itens antigos
// GET /api/dashboard/check-old-items
router.get('/check-old-items', checkOldItems);

module.exports = router; 