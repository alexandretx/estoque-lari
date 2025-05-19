const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Importar controladores
const {
    getVivoCelulares,
    getVivoCelular,
    createVivoCelular,
    updateVivoCelular,
    deleteVivoCelular
} = require('../controllers/vivoCelularController');

const {
    getVivoAcessorios,
    getVivoAcessorio,
    createVivoAcessorio,
    updateVivoAcessorio,
    deleteVivoAcessorio
} = require('../controllers/vivoAcessorioController');

// Proteger todas as rotas
router.use(protect);

// Rotas para celulares da Vivo
router.route('/celulares')
    .get(getVivoCelulares)
    .post(createVivoCelular);

router.route('/celulares/:id')
    .get(getVivoCelular)
    .put(updateVivoCelular)
    .delete(deleteVivoCelular);

// Rotas para acessórios da Vivo
router.route('/acessorios')
    .get(getVivoAcessorios)
    .post(createVivoAcessorio);

router.route('/acessorios/:id')
    .get(getVivoAcessorio)
    .put(updateVivoAcessorio)
    .delete(deleteVivoAcessorio);

module.exports = router; 