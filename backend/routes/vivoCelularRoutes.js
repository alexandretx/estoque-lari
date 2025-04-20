const express = require('express');
const router = express.Router();
const {
    createVivoCelular,
    getVivoCelulares,
    getVivoCelularById,
    updateVivoCelular,
    deleteVivoCelular
} = require('../controllers/vivoCelularController');
const { protect } = require('../middleware/authMiddleware');

// Proteger todas as rotas
router.use(protect);

// Rotas para /api/vivo/celulares
router.route('/')
    .get(getVivoCelulares)
    .post(createVivoCelular);

// Rotas para /api/vivo/celulares/:id
router.route('/:id')
    .get(getVivoCelularById)
    .put(updateVivoCelular)
    .delete(deleteVivoCelular);

module.exports = router;