const VivoAcessorio = require('../models/VivoAcessorio');
const Activity = require('../models/Activity');

// @desc    Obter todos os acessórios da Vivo
// @route   GET /api/vivo/acessorios
// @access  Private
const getVivoAcessorios = async (req, res) => {
    try {
        const acessorios = await VivoAcessorio.find();
        res.status(200).json(acessorios);
    } catch (error) {
        console.error('Erro ao buscar acessórios da Vivo:', error);
        res.status(500).json({ message: 'Erro ao buscar acessórios da Vivo' });
    }
};

// @desc    Obter um acessório da Vivo específico
// @route   GET /api/vivo/acessorios/:id
// @access  Private
const getVivoAcessorio = async (req, res) => {
    try {
        const acessorio = await VivoAcessorio.findById(req.params.id);
        
        if (!acessorio) {
            return res.status(404).json({ message: 'Acessório não encontrado' });
        }
        
        res.status(200).json(acessorio);
    } catch (error) {
        console.error('Erro ao buscar o acessório da Vivo:', error);
        res.status(500).json({ message: 'Erro ao buscar o acessório da Vivo' });
    }
};

// @desc    Criar um novo acessório da Vivo
// @route   POST /api/vivo/acessorios
// @access  Private
const createVivoAcessorio = async (req, res) => {
    try {
        // Adiciona o usuário que criou o registro
        req.body.user = req.user.id;
        
        const acessorio = await VivoAcessorio.create(req.body);
        
        // Registrar atividade
        await Activity.create({
            user: req.user.id,
            action: 'Adicionou um acessório Vivo',
            item: `${acessorio.tipo} ${acessorio.marca} ${acessorio.modelo}`,
            itemId: acessorio._id,
            itemModel: 'VivoAcessorio'
        });
        
        res.status(201).json(acessorio);
    } catch (error) {
        console.error('Erro ao criar acessório da Vivo:', error);
        res.status(500).json({ message: 'Erro ao criar acessório da Vivo' });
    }
};

// @desc    Atualizar um acessório da Vivo
// @route   PUT /api/vivo/acessorios/:id
// @access  Private
const updateVivoAcessorio = async (req, res) => {
    try {
        let acessorio = await VivoAcessorio.findById(req.params.id);
        
        if (!acessorio) {
            return res.status(404).json({ message: 'Acessório não encontrado' });
        }
        
        acessorio = await VivoAcessorio.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        // Registrar atividade
        await Activity.create({
            user: req.user.id,
            action: 'Atualizou um acessório Vivo',
            item: `${acessorio.tipo} ${acessorio.marca} ${acessorio.modelo}`,
            itemId: acessorio._id,
            itemModel: 'VivoAcessorio'
        });
        
        res.status(200).json(acessorio);
    } catch (error) {
        console.error('Erro ao atualizar acessório da Vivo:', error);
        res.status(500).json({ message: 'Erro ao atualizar acessório da Vivo' });
    }
};

// @desc    Excluir um acessório da Vivo
// @route   DELETE /api/vivo/acessorios/:id
// @access  Private
const deleteVivoAcessorio = async (req, res) => {
    try {
        const acessorio = await VivoAcessorio.findById(req.params.id);
        
        if (!acessorio) {
            return res.status(404).json({ message: 'Acessório não encontrado' });
        }
        
        await acessorio.deleteOne();
        
        // Registrar atividade
        await Activity.create({
            user: req.user.id,
            action: 'Removeu um acessório Vivo',
            item: `${acessorio.tipo} ${acessorio.marca} ${acessorio.modelo}`,
            itemId: acessorio._id,
            itemModel: 'VivoAcessorio'
        });
        
        res.status(200).json({ message: 'Acessório removido' });
    } catch (error) {
        console.error('Erro ao excluir acessório da Vivo:', error);
        res.status(500).json({ message: 'Erro ao excluir acessório da Vivo' });
    }
};

module.exports = {
    getVivoAcessorios,
    getVivoAcessorio,
    createVivoAcessorio,
    updateVivoAcessorio,
    deleteVivoAcessorio
}; 