const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getVivoCelulares,
  getVivoCelular,
  createVivoCelular,
  updateVivoCelular,
  deleteVivoCelular,
  getVivoAcessorios,
  getVivoAcessorio,
  createVivoAcessorio,
  updateVivoAcessorio,
  deleteVivoAcessorio,
} = require('../controllers/vivoController');

// Rotas para celulares
router.route('/celulares').get(protect, getVivoCelulares).post(protect, createVivoCelular);
router
  .route('/celulares/:id')
  .get(protect, getVivoCelular)
  .put(protect, updateVivoCelular)
  .delete(protect, deleteVivoCelular);

// Rotas para acessórios
router.route('/acessorios').get(protect, getVivoAcessorios).post(protect, createVivoAcessorio);
router
  .route('/acessorios/:id')
  .get(protect, getVivoAcessorio)
  .put(protect, updateVivoAcessorio)
  .delete(protect, deleteVivoAcessorio);

module.exports = router; 