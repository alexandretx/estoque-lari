const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getVivoDashboardStats, getVivoActivities } = require('../controllers/vivoDashboardController');

// @route   GET /api/vivo/stats
// @desc    Obter estatísticas do dashboard da Vivo
// @access  Private
router.get('/stats', protect, getVivoDashboardStats);

// @route   GET /api/vivo/activities
// @desc    Obter atividades recentes da Vivo
// @access  Private
router.get('/activities', protect, getVivoActivities);

module.exports = router;