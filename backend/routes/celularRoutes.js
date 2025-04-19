const express = require('express');
const router = express.Router();
const {
    getCelulares,
    getCelularById,
    createCelular,
    updateCelular,
    deleteCelular
} = require('../controllers/celularController');
const { protect } = require('../middleware/authMiddleware');

// Aplicar o middleware protect a todas as rotas abaixo
router.use(protect);

// Rotas para Celulares
router.route('/')
    .get(getCelulares)
    .post(createCelular);

router.route('/:id')
    .get(getCelularById)
    .put(updateCelular)
    .delete(deleteCelular);

module.exports = router; 