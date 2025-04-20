const VivoAcessorio = require('../models/VivoAcessorio');
const Activity = require('../models/Activity');

// @desc    Criar um novo acessório Vivo
// @route   POST /api/vivo/acessorios
// @access  Private
exports.createVivoAcessorio = async (req, res) => {
    try {
        // Criar o acessório no banco de dados
        const acessorio = await VivoAcessorio.create({
            ...req.body,
            user: req.user.id // Adicionar referência ao usuário que criou
        });

        // Registrar atividade
        await Activity.create({
            action: 'Cadastrou',
            item: `${acessorio.tipo} ${acessorio.marca}`,
            itemId: acessorio._id,
            itemType: 'vivoAcessorio',
            user: req.user.id,
            userName: req.user.nome || req.user.email
        });

        res.status(201).json(acessorio);
    } catch (error) {
        console.error('Erro ao criar acessório Vivo:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Obter todos os acessórios Vivo
// @route   GET /api/vivo/acessorios
// @access  Private
exports.getVivoAcessorios = async (req, res) => {
    try {
        const acessorios = await VivoAcessorio.find().sort({ createdAt: -1 });
        res.status(200).json(acessorios);
    } catch (error) {
        console.error('Erro ao buscar acessórios Vivo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Obter um acessório Vivo específico
// @route   GET /api/vivo/acessorios/:id
// @access  Private
exports.getVivoAcessorioById = async (req, res) => {
    try {
        const acessorio = await VivoAcessorio.findById(req.params.id);
        
        if (!acessorio) {
            return res.status(404).json({ message: 'Acessório não encontrado' });
        }
        
        res.status(200).json(acessorio);
    } catch (error) {
        console.error('Erro ao buscar acessório Vivo:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Acessório não encontrado' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Atualizar um acessório Vivo
// @route   PUT /api/vivo/acessorios/:id
// @access  Private
exports.updateVivoAcessorio = async (req, res) => {
    try {
        const acessorio = await VivoAcessorio.findById(req.params.id);
        
        if (!acessorio) {
            return res.status(404).json({ message: 'Acessório não encontrado' });
        }
        
        // Atualizar o acessório
        const updatedAcessorio = await VivoAcessorio.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        // Registrar atividade
        await Activity.create({
            action: 'Atualizou',
            item: `${updatedAcessorio.tipo} ${updatedAcessorio.marca}`,
            itemId: updatedAcessorio._id,
            itemType: 'vivoAcessorio',
            user: req.user.id,
            userName: req.user.nome || req.user.email
        });
        
        res.status(200).json(updatedAcessorio);
    } catch (error) {
        console.error('Erro ao atualizar acessório Vivo:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Acessório não encontrado' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
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
            return res.status(404).json({ message: 'Acessório não encontrado' });
        }
        
        // Armazenar informações do acessório antes de excluir
        const acessorioInfo = {
            tipo: acessorio.tipo,
            marca: acessorio.marca
        };
        
        // Excluir o acessório
        await acessorio.remove();
        
        // Registrar atividade
        await Activity.create({
            action: 'Excluiu',
            item: `${acessorioInfo.tipo} ${acessorioInfo.marca}`,
            itemType: 'vivoAcessorio',
            user: req.user.id,
            userName: req.user.nome || req.user.email
        });
        
        res.status(200).json({ message: 'Acessório excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir acessório Vivo:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Acessório não encontrado' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}; 