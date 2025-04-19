const express = require('express');
const router = express.Router();
const {
    getPlanos,
    getPlanoById,
    createPlano,
    updatePlano,
    deletePlano
} = require('../controllers/planoController');
const { protect } = require('../middleware/authMiddleware');

// Proteger todas as rotas de planos
router.use(protect);

router.route('/')
    .get(getPlanos)
    .post(createPlano);

router.route('/:id')
    .get(getPlanoById)
    .put(updatePlano)
    .delete(deletePlano);

module.exports = router; 