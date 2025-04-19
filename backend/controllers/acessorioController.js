const Acessorio = require('../models/Acessorio');
const { registerActivity } = require('./activityController');

// @desc    Listar todos os acessórios
// @route   GET /api/acessorios
// @access  Private
exports.getAcessorios = async (req, res) => {
    try {
        const acessorios = await Acessorio.find(); // .find({ user: req.user.id })
        res.status(200).json(acessorios);
    } catch (error) {
        console.error('Erro ao buscar acessórios:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Buscar um acessório específico por ID
// @route   GET /api/acessorios/:id
// @access  Private
exports.getAcessorioById = async (req, res) => {
    try {
        const acessorio = await Acessorio.findById(req.params.id);

        if (!acessorio) {
            return res.status(404).json({ message: 'Acessório não encontrado' });
        }

        // if (acessorio.user.toString() !== req.user.id) {
        //     return res.status(401).json({ message: 'Não autorizado' });
        // }

        res.status(200).json(acessorio);
    } catch (error) {
        console.error('Erro ao buscar acessório por ID:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de acessório inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Cadastrar um novo acessório
// @route   POST /api/acessorios
// @access  Private
exports.createAcessorio = async (req, res) => {
    // Extrair tanto os campos novos quanto os antigos para compatibilidade
    const { marca, modelo, tipo, valorProduto, nome, cor, quantidade, valor } = req.body;

    // Log dos dados recebidos para debug
    console.log('Dados recebidos:', req.body);

    try {
        const acessorio = await Acessorio.create({
            marca,
            modelo,
            tipo,
            valorProduto,
            nome,
            cor,
            quantidade,
            valor,
            // user: req.user.id
        });

        // Registrar atividade
        await registerActivity(
            'Acessório adicionado',
            marca && modelo ? `${marca} ${modelo}` : (nome || 'Acessório sem nome'),
            acessorio._id,
            'acessorio',
            req.user
        );

        res.status(201).json(acessorio);
    } catch (error) {
        console.error('Erro ao cadastrar acessório:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Atualizar um acessório
// @route   PUT /api/acessorios/:id
// @access  Private
exports.updateAcessorio = async (req, res) => {
    // Extrair tanto os campos novos quanto os antigos para compatibilidade
    const { marca, modelo, tipo, valorProduto, nome, cor, quantidade, valor } = req.body;

    try {
        let acessorio = await Acessorio.findById(req.params.id);

        if (!acessorio) {
            return res.status(404).json({ message: 'Acessório não encontrado' });
        }

        // if (acessorio.user.toString() !== req.user.id) {
        //     return res.status(401).json({ message: 'Não autorizado' });
        // }

        // Atualizar campos novos
        acessorio.marca = marca ?? acessorio.marca;
        acessorio.modelo = modelo ?? acessorio.modelo;
        acessorio.tipo = tipo ?? acessorio.tipo;
        acessorio.valorProduto = valorProduto ?? acessorio.valorProduto;
        
        // Manter campos antigos para compatibilidade
        acessorio.nome = nome ?? acessorio.nome;
        acessorio.cor = cor ?? acessorio.cor;
        acessorio.quantidade = quantidade ?? acessorio.quantidade;
        acessorio.valor = valor ?? acessorio.valor;

        await acessorio.validate();
        const acessorioAtualizado = await acessorio.save();

        // Registrar atividade
        await registerActivity(
            'Acessório atualizado',
            acessorioAtualizado.marca && acessorioAtualizado.modelo 
                ? `${acessorioAtualizado.marca} ${acessorioAtualizado.modelo}` 
                : (acessorioAtualizado.nome || 'Acessório sem nome'),
            acessorioAtualizado._id,
            'acessorio',
            req.user
        );

        res.status(200).json(acessorioAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar acessório:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de acessório inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Excluir um acessório
// @route   DELETE /api/acessorios/:id
// @access  Private
exports.deleteAcessorio = async (req, res) => {
    try {
        const acessorio = await Acessorio.findById(req.params.id);

        if (!acessorio) {
            return res.status(404).json({ message: 'Acessório não encontrado' });
        }

        // if (acessorio.user.toString() !== req.user.id) {
        //     return res.status(401).json({ message: 'Não autorizado' });
        // }

        // Guardar informações antes de excluir
        const acessorioInfo = acessorio.marca && acessorio.modelo 
            ? `${acessorio.marca} ${acessorio.modelo}` 
            : (acessorio.nome || 'Acessório sem nome');
        const acessorioId = acessorio._id;

        await acessorio.deleteOne();

        // Registrar atividade
        await registerActivity(
            'Acessório excluído',
            acessorioInfo,
            acessorioId,
            'acessorio',
            req.user
        );

        res.status(200).json({ message: 'Acessório excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir acessório:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de acessório inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}; 
