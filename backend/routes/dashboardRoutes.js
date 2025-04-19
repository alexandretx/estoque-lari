const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
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

module.exports = router; 
