const VivoCelular = require('../models/vivoCelularModel');
const VivoAcessorio = require('../models/vivoAcessorioModel');
const Activity = require('../models/activityModel');
const asyncHandler = require('express-async-handler');

// @desc    Obter estatísticas do dashboard da Vivo
// @route   GET /api/vivo/stats
// @access  Private
const getVivoDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Contagem de celulares
    const totalCelulares = await VivoCelular.countDocuments();
    
    // Valor total de celulares
    const celularesResult = await VivoCelular.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$valorCompra' }
        }
      }
    ]);
    const valorTotalCelulares = celularesResult.length > 0 ? celularesResult[0].total : 0;
    
    // Contagem de acessórios
    const totalAcessorios = await VivoAcessorio.countDocuments();
    
    // Valor total de acessórios
    const acessoriosResult = await VivoAcessorio.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$valorCompra' }
        }
      }
    ]);
    const valorTotalAcessorios = acessoriosResult.length > 0 ? acessoriosResult[0].total : 0;
    
    // Dados para gráfico de barras: celulares por marca
    const celularesPorMarca = await VivoCelular.aggregate([
      {
        $group: {
          _id: '$marca',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          marca: '$_id',
          quantidade: '$count',
          _id: 0
        }
      },
      {
        $sort: { quantidade: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    res.json({
      totalCelulares,
      valorTotalCelulares,
      totalAcessorios,
      valorTotalAcessorios,
      celularesPorMarca
    });
  } catch (error) {
    res.status(500);
    throw new Error('Erro ao obter estatísticas: ' + error.message);
  }
});

// @desc    Obter atividades recentes da Vivo
// @route   GET /api/vivo/activities
// @access  Private
const getVivoActivities = asyncHandler(async (req, res) => {
  try {
    const activities = await Activity.find({
      $or: [
        { resource: 'vivo-celular' },
        { resource: 'vivo-acessorio' }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name');
    
    res.json(activities);
  } catch (error) {
    res.status(500);
    throw new Error('Erro ao obter atividades recentes: ' + error.message);
  }
});

module.exports = {
  getVivoDashboardStats,
  getVivoActivities
}; 