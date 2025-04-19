const PlanoMovel = require('../models/PlanoMovel');

// @desc    Listar todos os planos móveis
// @route   GET /api/planos
// @access  Private
exports.getPlanos = async (req, res) => {
    try {
        const planos = await PlanoMovel.find(); // .find({ user: req.user.id })
        res.status(200).json(planos);
    } catch (error) {
        console.error('Erro ao buscar planos:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Buscar um plano móvel específico por ID
// @route   GET /api/planos/:id
// @access  Private
exports.getPlanoById = async (req, res) => {
    try {
        const plano = await PlanoMovel.findById(req.params.id);

        if (!plano) {
            return res.status(404).json({ message: 'Plano móvel não encontrado' });
        }

        // if (plano.user.toString() !== req.user.id) {
        //     return res.status(401).json({ message: 'Não autorizado' });
        // }

        res.status(200).json(plano);
    } catch (error) {
        console.error('Erro ao buscar plano por ID:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de plano inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Cadastrar um novo plano móvel
// @route   POST /api/planos
// @access  Private
exports.createPlano = async (req, res) => {
    const { nome, valor } = req.body;

    try {
        const plano = await PlanoMovel.create({
            nome,
            valor,
            // user: req.user.id
        });
        res.status(201).json(plano);
    } catch (error) {
        console.error('Erro ao cadastrar plano:', error);
        // Tratar erro de chave única (nome do plano)
        if (error.code === 11000) {
             return res.status(400).json({ message: 'Já existe um plano com este nome' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Atualizar um plano móvel
// @route   PUT /api/planos/:id
// @access  Private
exports.updatePlano = async (req, res) => {
    const { nome, valor } = req.body;

    try {
        let plano = await PlanoMovel.findById(req.params.id);

        if (!plano) {
            return res.status(404).json({ message: 'Plano móvel não encontrado' });
        }

        // if (plano.user.toString() !== req.user.id) {
        //     return res.status(401).json({ message: 'Não autorizado' });
        // }

        plano.nome = nome ?? plano.nome;
        plano.valor = valor ?? plano.valor;

        await plano.validate();
        const planoAtualizado = await plano.save();

        res.status(200).json(planoAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar plano:', error);
         // Tratar erro de chave única (nome do plano)
        if (error.code === 11000) {
             return res.status(400).json({ message: 'Já existe um plano com este nome' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de plano inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Excluir um plano móvel
// @route   DELETE /api/planos/:id
// @access  Private
exports.deletePlano = async (req, res) => {
    try {
        const plano = await PlanoMovel.findById(req.params.id);

        if (!plano) {
            return res.status(404).json({ message: 'Plano móvel não encontrado' });
        }

        // if (plano.user.toString() !== req.user.id) {
        //     return res.status(401).json({ message: 'Não autorizado' });
        // }

        await plano.deleteOne();

        res.status(200).json({ message: 'Plano móvel excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir plano:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de plano inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}; 