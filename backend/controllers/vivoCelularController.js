const asyncHandler = require('express-async-handler');
const VivoCelular = require('../models/VivoCelular');
const Atividade = require('../models/Atividade');

// @desc    Obter todos os celulares
// @route   GET /api/vivo/celulares
// @access  Private
const getCelulares = asyncHandler(async (req, res) => {
    const celulares = await VivoCelular.find({ user: req.user.id });
    res.status(200).json(celulares);
});

// @desc    Obter um celular específico
// @route   GET /api/vivo/celulares/:id
// @access  Private
const getCelular = asyncHandler(async (req, res) => {
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

// @desc    Criar um novo celular
// @route   POST /api/vivo/celulares
// @access  Private
const createCelular = asyncHandler(async (req, res) => {
    const { marca, modelo, imei, armazenamento, memoriaRAM, cor, estado, valorCompra, precoVenda, dataCompra, observacoes, acessorios } = req.body;

    if (!marca || !modelo || !armazenamento || !valorCompra) {
        res.status(400);
        throw new Error('Por favor, preencha todos os campos obrigatórios');
    }

    const celular = await VivoCelular.create({
        marca,
        modelo,
        imei,
        armazenamento,
        memoriaRAM,
        cor,
        estado,
        valorCompra,
        precoVenda,
        dataCompra: dataCompra ? new Date(dataCompra) : new Date(),
        observacoes,
        acessorios,
        user: req.user.id
    });

    // Registrar a atividade
    await Atividade.create({
        tipo: 'compra',
        descricao: `Compra de celular: ${marca} ${modelo}`,
        valor: valorCompra,
        data: new Date(),
        entidade: 'VivoCelular',
        entidadeId: celular._id,
        user: req.user.id
    });

    res.status(201).json(celular);
});

// @desc    Atualizar um celular
// @route   PUT /api/vivo/celulares/:id
// @access  Private
const updateCelular = asyncHandler(async (req, res) => {
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

    // Verificar se o celular está sendo vendido
    if (!celular.vendido && req.body.vendido) {
        // Registrar a atividade de venda
        await Atividade.create({
            tipo: 'venda',
            descricao: `Venda de celular: ${celular.marca} ${celular.modelo}`,
            valor: req.body.precoVenda || celular.precoVenda,
            data: req.body.dataVenda ? new Date(req.body.dataVenda) : new Date(),
            entidade: 'VivoCelular',
            entidadeId: celular._id,
            user: req.user.id
        });
    }

    const updatedCelular = await VivoCelular.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json(updatedCelular);
});

// @desc    Excluir um celular
// @route   DELETE /api/vivo/celulares/:id
// @access  Private
const deleteCelular = asyncHandler(async (req, res) => {
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

    // Registrar a atividade
    await Atividade.create({
        tipo: 'exclusao',
        descricao: `Exclusão de celular: ${celular.marca} ${celular.modelo}`,
        valor: 0,
        data: new Date(),
        entidade: 'VivoCelular',
        entidadeId: celular._id,
        user: req.user.id
    });

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getCelulares,
    getCelular,
    createCelular,
    updateCelular,
    deleteCelular
}; 