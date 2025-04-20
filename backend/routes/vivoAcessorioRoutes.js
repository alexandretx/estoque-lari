const express = require('express');
const router = express.Router();
const {
    createVivoAcessorio,
    getVivoAcessorios,
    getVivoAcessorioById,
    updateVivoAcessorio,
    deleteVivoAcessorio
} = require('../controllers/vivoAcessorioController');
const { protect } = require('../middleware/authMiddleware');

// Proteger todas as rotas
router.use(protect);

// Rotas para /api/vivo/acessorios
router.route('/')
    .get(getVivoAcessorios)
    .post(createVivoAcessorio);

// Rotas para /api/vivo/acessorios/:id
router.route('/:id')
    .get(getVivoAcessorioById)
    .put(updateVivoAcessorio)
    .delete(deleteVivoAcessorio);

module.exports = router; 