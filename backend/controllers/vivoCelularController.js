const VivoCelular = require('../models/VivoCelular');
const Activity = require('../models/Activity');

// @desc    Obter todos os celulares da Vivo
// @route   GET /api/vivo/celulares
// @access  Private
const getVivoCelulares = async (req, res) => {
    try {
        const celulares = await VivoCelular.find();
        res.status(200).json(celulares);
    } catch (error) {
        console.error('Erro ao buscar celulares da Vivo:', error);
        res.status(500).json({ message: 'Erro ao buscar celulares da Vivo' });
    }
};

// @desc    Obter um celular da Vivo específico
// @route   GET /api/vivo/celulares/:id
// @access  Private
const getVivoCelular = async (req, res) => {
    try {
        const celular = await VivoCelular.findById(req.params.id);
        
        if (!celular) {
            return res.status(404).json({ message: 'Celular não encontrado' });
        }
        
        res.status(200).json(celular);
    } catch (error) {
        console.error('Erro ao buscar o celular da Vivo:', error);
        res.status(500).json({ message: 'Erro ao buscar o celular da Vivo' });
    }
};

// @desc    Criar um novo celular da Vivo
// @route   POST /api/vivo/celulares
// @access  Private
const createVivoCelular = async (req, res) => {
    try {
        // Adiciona o usuário que criou o registro
        req.body.user = req.user.id;
        
        const celular = await VivoCelular.create(req.body);
        
        // Registrar atividade
        await Activity.create({
            user: req.user.id,
            action: 'Adicionou um celular Vivo',
            item: `${celular.marca} ${celular.modelo}`,
            itemId: celular._id,
            itemModel: 'VivoCelular'
        });
        
        res.status(201).json(celular);
    } catch (error) {
        console.error('Erro ao criar celular da Vivo:', error);
        res.status(500).json({ message: 'Erro ao criar celular da Vivo' });
    }
};

// @desc    Atualizar um celular da Vivo
// @route   PUT /api/vivo/celulares/:id
// @access  Private
const updateVivoCelular = async (req, res) => {
    try {
        let celular = await VivoCelular.findById(req.params.id);
        
        if (!celular) {
            return res.status(404).json({ message: 'Celular não encontrado' });
        }
        
        celular = await VivoCelular.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        // Registrar atividade
        await Activity.create({
            user: req.user.id,
            action: 'Atualizou um celular Vivo',
            item: `${celular.marca} ${celular.modelo}`,
            itemId: celular._id,
            itemModel: 'VivoCelular'
        });
        
        res.status(200).json(celular);
    } catch (error) {
        console.error('Erro ao atualizar celular da Vivo:', error);
        res.status(500).json({ message: 'Erro ao atualizar celular da Vivo' });
    }
};

// @desc    Excluir um celular da Vivo
// @route   DELETE /api/vivo/celulares/:id
// @access  Private
const deleteVivoCelular = async (req, res) => {
    try {
        const celular = await VivoCelular.findById(req.params.id);
        
        if (!celular) {
            return res.status(404).json({ message: 'Celular não encontrado' });
        }
        
        await celular.deleteOne();
        
        // Registrar atividade
        await Activity.create({
            user: req.user.id,
            action: 'Removeu um celular Vivo',
            item: `${celular.marca} ${celular.modelo}`,
            itemId: celular._id,
            itemModel: 'VivoCelular'
        });
        
        res.status(200).json({ message: 'Celular removido' });
    } catch (error) {
        console.error('Erro ao excluir celular da Vivo:', error);
        res.status(500).json({ message: 'Erro ao excluir celular da Vivo' });
    }
};

module.exports = {
    getVivoCelulares,
    getVivoCelular,
    createVivoCelular,
    updateVivoCelular,
    deleteVivoCelular
}; 