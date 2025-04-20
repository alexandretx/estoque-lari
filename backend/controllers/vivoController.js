const asyncHandler = require('express-async-handler');
const VivoCelular = require('../models/vivoCelularModel');
const VivoAcessorio = require('../models/vivoAcessorioModel');
const Activity = require('../models/activityModel');

// @desc    Get celulares Vivo
// @route   GET /api/vivo/celulares
// @access  Private
const getVivoCelulares = asyncHandler(async (req, res) => {
  const celulares = await VivoCelular.find({ user: req.user.id });
  res.status(200).json(celulares);
});

// @desc    Get celular Vivo
// @route   GET /api/vivo/celulares/:id
// @access  Private
const getVivoCelular = asyncHandler(async (req, res) => {
  const celular = await VivoCelular.findById(req.params.id);

  if (!celular) {
    res.status(404);
    throw new Error('Celular não encontrado');
  }

  // Verificar se o celular pertence ao usuário
  if (celular.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Não autorizado');
  }

  res.status(200).json(celular);
});

// @desc    Create celular Vivo
// @route   POST /api/vivo/celulares
// @access  Private
const createVivoCelular = asyncHandler(async (req, res) => {
  const { marca, modelo, imei, armazenamento, ram, cor, observacoes, valorCompra, dataCompra } = req.body;

  if (!marca || !modelo || !imei || !armazenamento || !ram || !cor || !valorCompra || !dataCompra) {
    res.status(400);
    throw new Error('Por favor, preencha todos os campos obrigatórios');
  }

  const celular = await VivoCelular.create({
    user: req.user.id,
    marca,
    modelo,
    imei,
    armazenamento,
    ram,
    cor,
    observacoes,
    valorCompra,
    dataCompra
  });

  // Registrar atividade
  await Activity.create({
    user: req.user.id,
    action: 'create',
    category: 'vivoCelular',
    description: `Celular Vivo adicionado: ${marca} ${modelo}`
  });

  res.status(201).json(celular);
});

// @desc    Update celular Vivo
// @route   PUT /api/vivo/celulares/:id
// @access  Private
const updateVivoCelular = asyncHandler(async (req, res) => {
  const celular = await VivoCelular.findById(req.params.id);

  if (!celular) {
    res.status(404);
    throw new Error('Celular não encontrado');
  }

  // Verificar se o celular pertence ao usuário
  if (celular.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Não autorizado');
  }

  const updatedCelular = await VivoCelular.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  // Registrar atividade
  await Activity.create({
    user: req.user.id,
    action: 'update',
    category: 'vivoCelular',
    description: `Celular Vivo atualizado: ${updatedCelular.marca} ${updatedCelular.modelo}`
  });

  res.status(200).json(updatedCelular);
});

// @desc    Delete celular Vivo
// @route   DELETE /api/vivo/celulares/:id
// @access  Private
const deleteVivoCelular = asyncHandler(async (req, res) => {
  const celular = await VivoCelular.findById(req.params.id);

  if (!celular) {
    res.status(404);
    throw new Error('Celular não encontrado');
  }

  // Verificar se o celular pertence ao usuário
  if (celular.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Não autorizado');
  }

  await celular.deleteOne();

  // Registrar atividade
  await Activity.create({
    user: req.user.id,
    action: 'delete',
    category: 'vivoCelular',
    description: `Celular Vivo removido: ${celular.marca} ${celular.modelo}`
  });

  res.status(200).json({ id: req.params.id });
});

// @desc    Get acessórios Vivo
// @route   GET /api/vivo/acessorios
// @access  Private
const getVivoAcessorios = asyncHandler(async (req, res) => {
  const acessorios = await VivoAcessorio.find({ user: req.user.id });
  res.status(200).json(acessorios);
});

// @desc    Get acessório Vivo
// @route   GET /api/vivo/acessorios/:id
// @access  Private
const getVivoAcessorio = asyncHandler(async (req, res) => {
  const acessorio = await VivoAcessorio.findById(req.params.id);

  if (!acessorio) {
    res.status(404);
    throw new Error('Acessório não encontrado');
  }

  // Verificar se o acessório pertence ao usuário
  if (acessorio.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Não autorizado');
  }

  res.status(200).json(acessorio);
});

// @desc    Create acessório Vivo
// @route   POST /api/vivo/acessorios
// @access  Private
const createVivoAcessorio = asyncHandler(async (req, res) => {
  const { tipo, marca, modelo, cor, observacoes, valorCompra, dataCompra } = req.body;

  if (!tipo || !marca || !modelo || !cor || !valorCompra || !dataCompra) {
    res.status(400);
    throw new Error('Por favor, preencha todos os campos obrigatórios');
  }

  const acessorio = await VivoAcessorio.create({
    user: req.user.id,
    tipo,
    marca,
    modelo,
    cor,
    observacoes,
    valorCompra,
    dataCompra
  });

  // Registrar atividade
  await Activity.create({
    user: req.user.id,
    action: 'create',
    category: 'vivoAcessorio',
    description: `Acessório Vivo adicionado: ${tipo} ${marca} ${modelo}`
  });

  res.status(201).json(acessorio);
});

// @desc    Update acessório Vivo
// @route   PUT /api/vivo/acessorios/:id
// @access  Private
const updateVivoAcessorio = asyncHandler(async (req, res) => {
  const acessorio = await VivoAcessorio.findById(req.params.id);

  if (!acessorio) {
    res.status(404);
    throw new Error('Acessório não encontrado');
  }

  // Verificar se o acessório pertence ao usuário
  if (acessorio.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Não autorizado');
  }

  const updatedAcessorio = await VivoAcessorio.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  // Registrar atividade
  await Activity.create({
    user: req.user.id,
    action: 'update',
    category: 'vivoAcessorio',
    description: `Acessório Vivo atualizado: ${updatedAcessorio.tipo} ${updatedAcessorio.marca} ${updatedAcessorio.modelo}`
  });

  res.status(200).json(updatedAcessorio);
});

// @desc    Delete acessório Vivo
// @route   DELETE /api/vivo/acessorios/:id
// @access  Private
const deleteVivoAcessorio = asyncHandler(async (req, res) => {
  const acessorio = await VivoAcessorio.findById(req.params.id);

  if (!acessorio) {
    res.status(404);
    throw new Error('Acessório não encontrado');
  }

  // Verificar se o acessório pertence ao usuário
  if (acessorio.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Não autorizado');
  }

  await acessorio.deleteOne();

  // Registrar atividade
  await Activity.create({
    user: req.user.id,
    action: 'delete',
    category: 'vivoAcessorio',
    description: `Acessório Vivo removido: ${acessorio.tipo} ${acessorio.marca} ${acessorio.modelo}`
  });

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getVivoCelulares,
  getVivoCelular,
  createVivoCelular,
  updateVivoCelular,
  deleteVivoCelular,
  getVivoAcessorios,
  getVivoAcessorio,
  createVivoAcessorio,
  updateVivoAcessorio,
  deleteVivoAcessorio
}; 