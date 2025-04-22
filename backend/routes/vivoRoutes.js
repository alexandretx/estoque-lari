const express = require('express');
const router = express.Router();
const { 
    getVivoCelulares, 
    getVivoCelularById, 
    createVivoCelular, 
    updateVivoCelular, 
    deleteVivoCelular 
} = require('../controllers/vivoCelularController');
const { 
    getVivoAcessorios, 
    getVivoAcessorioById, 
    createVivoAcessorio, 
    updateVivoAcessorio, 
    deleteVivoAcessorio 
} = require('../controllers/vivoAcessorioController');

// Middleware de autenticação (assumindo que você tenha um)
// const { protect } = require('../middleware/authMiddleware');

// Aplicar middleware de proteção a todas as rotas Vivo se necessário
// router.use(protect);

// --- Rotas para Celulares Vivo ---
router.route('/celulares')
    .get(getVivoCelulares)       // Listar todos os celulares Vivo
    .post(createVivoCelular);     // Criar novo celular Vivo

router.route('/celulares/:id')
    .get(getVivoCelularById)     // Obter celular Vivo por ID
    .put(updateVivoCelular)      // Atualizar celular Vivo por ID
    .delete(deleteVivoCelular);   // Excluir celular Vivo por ID

// --- Rotas para Acessórios Vivo ---
router.route('/acessorios')
    .get(getVivoAcessorios)      // Listar todos os acessórios Vivo
    .post(createVivoAcessorio);    // Criar novo acessório Vivo

router.route('/acessorios/:id')
    .get(getVivoAcessorioById)    // Obter acessório Vivo por ID
    .put(updateVivoAcessorio)     // Atualizar acessório Vivo por ID
    .delete(deleteVivoAcessorio);  // Excluir acessório Vivo por ID

module.exports = router; 