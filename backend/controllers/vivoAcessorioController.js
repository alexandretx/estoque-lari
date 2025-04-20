const VivoAcessorio = require('../models/VivoAcessorio');
const { registerActivity } = require('./activityController');

// @desc    Listar todos os acessórios da Vivo
// @route   GET /api/vivo/acessorios
// @access  Private
exports.getVivoAcessorios = async (req, res) => {
    try {
        const acessorios = await VivoAcessorio.find();
        res.status(200).json(acessorios);
    } catch (error) {
        console.error('Erro ao buscar acessórios da Vivo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Buscar um acessório da Vivo específico por ID
// @route   GET /api/vivo/acessorios/:id
// @access  Private
exports.getVivoAcessorioById = async (req, res) => {
    try {
        const acessorio = await VivoAcessorio.findById(req.params.id);

        if (!acessorio) {
            return res.status(404).json({ message: 'Acessório da Vivo não encontrado' });
        }

        res.status(200).json(acessorio);
    } catch (error) {
        console.error('Erro ao buscar acessório da Vivo por ID:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de acessório inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Cadastrar um novo acessório da Vivo
// @route   POST /api/vivo/acessorios
// @access  Private
exports.createVivoAcessorio = async (req, res) => {
    const { 
        marca, modelo, tipo, cor, material, valorCompra, dataCompra, observacoes,
        isVendido, dataVenda, valorVenda, clienteNome, clienteTelefone
    } = req.body;

    try {
        const acessorio = await VivoAcessorio.create({
            marca,
            modelo,
            tipo,
            cor,
            material,
            valorCompra,
            dataCompra,
            observacoes,
            isVendido,
            dataVenda,
            valorVenda,
            clienteNome,
            clienteTelefone
        });

        // Registrar atividade
        await registerActivity(
            'Acessório Vivo adicionado',
            `${tipo} ${marca} ${modelo}`,
            acessorio._id,
            'acessorio',
            req.user
        );

        res.status(201).json(acessorio);
    } catch (error) {
        console.error('Erro ao cadastrar acessório da Vivo:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Atualizar um acessório da Vivo
// @route   PUT /api/vivo/acessorios/:id
// @access  Private
exports.updateVivoAcessorio = async (req, res) => {
    const { 
        marca, modelo, tipo, cor, material, valorCompra, dataCompra, observacoes,
        isVendido, dataVenda, valorVenda, clienteNome, clienteTelefone
    } = req.body;

    try {
        let acessorio = await VivoAcessorio.findById(req.params.id);

        if (!acessorio) {
            return res.status(404).json({ message: 'Acessório da Vivo não encontrado' });
        }

        // Atualizar todos os campos
        acessorio.marca = marca ?? acessorio.marca;
        acessorio.modelo = modelo ?? acessorio.modelo;
        acessorio.tipo = tipo ?? acessorio.tipo;
        acessorio.cor = cor ?? acessorio.cor;
        acessorio.material = material ?? acessorio.material;
        acessorio.valorCompra = valorCompra ?? acessorio.valorCompra;
        acessorio.dataCompra = dataCompra ?? acessorio.dataCompra;
        acessorio.observacoes = observacoes ?? acessorio.observacoes;
        
        // Campos específicos da Vivo
        acessorio.isVendido = isVendido !== undefined ? isVendido : acessorio.isVendido;
        acessorio.dataVenda = dataVenda ?? acessorio.dataVenda;
        acessorio.valorVenda = valorVenda ?? acessorio.valorVenda;
        acessorio.clienteNome = clienteNome ?? acessorio.clienteNome;
        acessorio.clienteTelefone = clienteTelefone ?? acessorio.clienteTelefone;

        // Validar antes de salvar
        await acessorio.validate();
        const acessorioAtualizado = await acessorio.save();

        // Registrar atividade
        await registerActivity(
            'Acessório Vivo atualizado',
            `${acessorioAtualizado.tipo} ${acessorioAtualizado.marca} ${acessorioAtualizado.modelo}`,
            acessorioAtualizado._id,
            'acessorio',
            req.user
        );

        res.status(200).json(acessorioAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar acessório da Vivo:', error);
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

// @desc    Excluir um acessório da Vivo
// @route   DELETE /api/vivo/acessorios/:id
// @access  Private
exports.deleteVivoAcessorio = async (req, res) => {
    try {
        const acessorio = await VivoAcessorio.findById(req.params.id);

        if (!acessorio) {
            return res.status(404).json({ message: 'Acessório da Vivo não encontrado' });
        }

        const acessorioInfo = `${acessorio.tipo} ${acessorio.marca} ${acessorio.modelo}`;
        const acessorioId = acessorio._id;

        await acessorio.deleteOne();

        // Registrar atividade
        await registerActivity(
            'Acessório Vivo excluído',
            acessorioInfo,
            acessorioId,
            'acessorio',
            req.user
        );

        res.status(200).json({ message: 'Acessório da Vivo excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir acessório da Vivo:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de acessório inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}; 