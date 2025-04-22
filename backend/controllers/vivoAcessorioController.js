// Controller para Acessórios da Vivo

const VivoAcessorio = require('../models/VivoAcessorio');
const { registerActivity } = require('./activityController');

// @desc    Listar todos os acessórios Vivo com paginação, busca e ordenação
// @route   GET /api/vivo/acessorios
// @access  Private
exports.getVivoAcessorios = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const searchTerm = req.query.search || '';
        const sortBy = req.query.sortBy || 'marca'; // Padrão marca
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Padrão asc

        let queryFilter = {};
        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            queryFilter = {
                $or: [
                    { marca: regex },
                    { modelo: regex },
                    { tipo: regex }, 
                    { observacoes: regex }
                ]
            };
        }

        const sortOptions = {};
        const validSortKeys = ['marca', 'modelo', 'tipo', 'createdAt', 'dataCompra', 'valorProduto']; 
        if (validSortKeys.includes(sortBy)) {
            sortOptions[sortBy] = sortOrder;
        } else {
            sortOptions['marca'] = 1; 
        }

        const totalAcessorios = await VivoAcessorio.countDocuments(queryFilter); 

        const acessorios = await VivoAcessorio.find(queryFilter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
            
        res.status(200).json({
            acessorios,
            currentPage: page,
            totalPages: Math.ceil(totalAcessorios / limit),
            totalAcessorios
        });
    } catch (error) {
        console.error('Erro ao buscar acessórios Vivo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Buscar um acessório Vivo específico por ID
// @route   GET /api/vivo/acessorios/:id
// @access  Private
exports.getVivoAcessorioById = async (req, res) => {
    try {
        const acessorio = await VivoAcessorio.findById(req.params.id);
        if (!acessorio) {
            return res.status(404).json({ message: 'Acessório Vivo não encontrado' });
        }
        res.status(200).json(acessorio);
    } catch (error) {
        console.error('Erro ao buscar acessório Vivo por ID:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de acessório Vivo inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Cadastrar um novo acessório Vivo
// @route   POST /api/vivo/acessorios
// @access  Private
exports.createVivoAcessorio = async (req, res) => {
    const { marca, modelo, tipo, valorProduto, observacoes, dataCompra } = req.body;

    try {
        const acessorio = await VivoAcessorio.create({
            marca,
            modelo,
            tipo,
            valorProduto,
            observacoes,
            dataCompra,
            // user: req.user.id // Se necessário
        });

        // Registrar atividade
        await registerActivity(
            'Acessório Vivo adicionado',
            `${acessorio.marca} ${acessorio.modelo || acessorio.tipo}`,
            acessorio._id,
            'vivo-acessorio', // Tipo específico
            req.user
        );

        res.status(201).json(acessorio);
    } catch (error) {
        console.error('Erro ao cadastrar acessório Vivo:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            const errors = {};
            Object.values(error.errors).forEach(err => { errors[err.path] = err.message; });
            return res.status(400).json({ message: messages.join(', '), errors });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Atualizar um acessório Vivo
// @route   PUT /api/vivo/acessorios/:id
// @access  Private
exports.updateVivoAcessorio = async (req, res) => {
    const { marca, modelo, tipo, valorProduto, observacoes, dataCompra } = req.body;

    try {
        let acessorio = await VivoAcessorio.findById(req.params.id);
        if (!acessorio) {
            return res.status(404).json({ message: 'Acessório Vivo não encontrado' });
        }

        acessorio.marca = marca ?? acessorio.marca;
        acessorio.modelo = modelo ?? acessorio.modelo;
        acessorio.tipo = tipo ?? acessorio.tipo;
        acessorio.valorProduto = valorProduto ?? acessorio.valorProduto;
        acessorio.observacoes = observacoes ?? acessorio.observacoes;
        acessorio.dataCompra = dataCompra ?? acessorio.dataCompra;

        await acessorio.validate();
        const acessorioAtualizado = await acessorio.save();

        // Registrar atividade
        await registerActivity(
            'Acessório Vivo atualizado',
            `${acessorioAtualizado.marca} ${acessorioAtualizado.modelo || acessorioAtualizado.tipo}`,
            acessorioAtualizado._id,
            'vivo-acessorio',
            req.user
        );

        res.status(200).json(acessorioAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar acessório Vivo:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            const errors = {};
            Object.values(error.errors).forEach(err => { errors[err.path] = err.message; });
            return res.status(400).json({ message: messages.join(', '), errors });
        }
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de acessório Vivo inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Excluir um acessório Vivo
// @route   DELETE /api/vivo/acessorios/:id
// @access  Private
exports.deleteVivoAcessorio = async (req, res) => {
    try {
        const acessorio = await VivoAcessorio.findById(req.params.id);
        if (!acessorio) {
            return res.status(404).json({ message: 'Acessório Vivo não encontrado' });
        }

        const acessorioInfo = `${acessorio.marca} ${acessorio.modelo || acessorio.tipo}`;
        const acessorioId = acessorio._id;

        await acessorio.deleteOne();

        // Registrar atividade
        await registerActivity(
            'Acessório Vivo excluído',
            acessorioInfo,
            acessorioId,
            'vivo-acessorio',
            req.user
        );

        res.status(200).json({ message: 'Acessório Vivo excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir acessório Vivo:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de acessório Vivo inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}; 