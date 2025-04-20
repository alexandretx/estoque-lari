const VivoCelular = require('../models/VivoCelular');
const Activity = require('../models/Activity');

// @desc    Criar um novo celular Vivo
// @route   POST /api/vivo/celulares
// @access  Private
exports.createVivoCelular = async (req, res) => {
    try {
        // Criar o celular no banco de dados
        const celular = await VivoCelular.create({
            ...req.body,
            user: req.user.id // Adicionar referência ao usuário que criou
        });

        // Registrar atividade
        await Activity.create({
            action: 'Cadastrou',
            item: `${celular.marca} ${celular.modelo}`,
            itemId: celular._id,
            itemType: 'vivoCelular',
            user: req.user.id,
            userName: req.user.nome || req.user.email
        });

        res.status(201).json(celular);
    } catch (error) {
        console.error('Erro ao criar celular Vivo:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Obter todos os celulares Vivo
// @route   GET /api/vivo/celulares
// @access  Private
exports.getVivoCelulares = async (req, res) => {
    try {
        const celulares = await VivoCelular.find().sort({ createdAt: -1 });
        res.status(200).json(celulares);
    } catch (error) {
        console.error('Erro ao buscar celulares Vivo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Obter um celular Vivo específico
// @route   GET /api/vivo/celulares/:id
// @access  Private
exports.getVivoCelularById = async (req, res) => {
    try {
        const celular = await VivoCelular.findById(req.params.id);
        
        if (!celular) {
            return res.status(404).json({ message: 'Celular não encontrado' });
        }
        
        res.status(200).json(celular);
    } catch (error) {
        console.error('Erro ao buscar celular Vivo:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Celular não encontrado' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Atualizar um celular Vivo
// @route   PUT /api/vivo/celulares/:id
// @access  Private
exports.updateVivoCelular = async (req, res) => {
    try {
        const celular = await VivoCelular.findById(req.params.id);
        
        if (!celular) {
            return res.status(404).json({ message: 'Celular não encontrado' });
        }
        
        // Atualizar o celular
        const updatedCelular = await VivoCelular.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        // Registrar atividade
        await Activity.create({
            action: 'Atualizou',
            item: `${updatedCelular.marca} ${updatedCelular.modelo}`,
            itemId: updatedCelular._id,
            itemType: 'vivoCelular',
            user: req.user.id,
            userName: req.user.nome || req.user.email
        });
        
        res.status(200).json(updatedCelular);
    } catch (error) {
        console.error('Erro ao atualizar celular Vivo:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Celular não encontrado' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Excluir um celular Vivo
// @route   DELETE /api/vivo/celulares/:id
// @access  Private
exports.deleteVivoCelular = async (req, res) => {
    try {
        const celular = await VivoCelular.findById(req.params.id);
        
        if (!celular) {
            return res.status(404).json({ message: 'Celular não encontrado' });
        }
        
        // Armazenar informações do celular antes de excluir
        const celularInfo = {
            marca: celular.marca,
            modelo: celular.modelo
        };
        
        // Excluir o celular
        await celular.remove();
        
        // Registrar atividade
        await Activity.create({
            action: 'Excluiu',
            item: `${celularInfo.marca} ${celularInfo.modelo}`,
            itemType: 'vivoCelular',
            user: req.user.id,
            userName: req.user.nome || req.user.email
        });
        
        res.status(200).json({ message: 'Celular excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir celular Vivo:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Celular não encontrado' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}; 