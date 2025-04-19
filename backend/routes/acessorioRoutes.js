const express = require('express');
const router = express.Router();
const {
    getAcessorios,
    getAcessorioById,
    createAcessorio,
    updateAcessorio,
    deleteAcessorio
} = require('../controllers/acessorioController');
const { protect } = require('../middleware/authMiddleware');

// Proteger todas as rotas de acessórios
router.use(protect);

router.route('/')
    .get(getAcessorios)
    .post(createAcessorio);

router.route('/:id')
    .get(getAcessorioById)
    .put(updateAcessorio)
    .delete(deleteAcessorio);

module.exports = router; 