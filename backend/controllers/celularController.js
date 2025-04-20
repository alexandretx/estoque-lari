const Celular = require('../models/Celular');
const { registerActivity } = require('./activityController');

// @desc    Listar todos os celulares
// @route   GET /api/celulares
// @access  Private
exports.getCelulares = async (req, res) => {
    try {
        const celulares = await Celular.find(); // Poderia filtrar por usuário: .find({ user: req.user.id })
        res.status(200).json(celulares);
    } catch (error) {
        console.error('Erro ao buscar celulares:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Buscar um celular específico por ID
// @route   GET /api/celulares/:id
// @access  Private
exports.getCelularById = async (req, res) => {
    try {
        const celular = await Celular.findById(req.params.id);

        if (!celular) {
            return res.status(404).json({ message: 'Celular não encontrado' });
        }

        // Opcional: Verificar se o celular pertence ao usuário logado
        // if (celular.user.toString() !== req.user.id) {
        //     return res.status(401).json({ message: 'Não autorizado' });
        // }

        res.status(200).json(celular);
    } catch (error) {
        console.error('Erro ao buscar celular por ID:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de celular inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Cadastrar um novo celular
// @route   POST /api/celulares
// @access  Private
exports.createCelular = async (req, res) => {
    // Extrair tanto os campos novos quanto os antigos para compatibilidade
    const { 
        marca, modelo, imei, armazenamento, ram, cor, observacoes, valorCompra, dataCompra, 
        nome, quantidade, valor 
    } = req.body;

    // Log dos dados recebidos para debug
    console.log('Dados recebidos:', req.body);

    try {
        const celular = await Celular.create({
            // Novos campos
            marca,
            modelo,
            imei,
            armazenamento,
            ram,
            cor,
            observacoes,
            valorCompra,
            dataCompra,
            // Campos antigos para compatibilidade
            nome,
            quantidade,
            valor,
            // user: req.user.id // Associa o celular ao usuário logado
        });

        // Registrar atividade
        await registerActivity(
            'Celular adicionado',
            `${marca} ${modelo}`,
            celular._id,
            'celular',
            req.user
        );

        res.status(201).json(celular);
    } catch (error) {
        console.error('Erro ao cadastrar celular:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Atualizar um celular
// @route   PUT /api/celulares/:id
// @access  Private
exports.updateCelular = async (req, res) => {
    // Extrair tanto os campos novos quanto os antigos para compatibilidade
    const { 
        marca, modelo, imei, armazenamento, ram, cor, observacoes, valorCompra, dataCompra, 
        nome, quantidade, valor 
    } = req.body;

    try {
        let celular = await Celular.findById(req.params.id);

        if (!celular) {
            return res.status(404).json({ message: 'Celular não encontrado' });
        }

        // Opcional: Verificar se o celular pertence ao usuário logado
        // if (celular.user.toString() !== req.user.id) {
        //     return res.status(401).json({ message: 'Não autorizado a atualizar este celular' });
        // }

        // Atualiza os campos novos
        celular.marca = marca ?? celular.marca;
        celular.modelo = modelo ?? celular.modelo;
        celular.imei = imei ?? celular.imei;
        celular.armazenamento = armazenamento ?? celular.armazenamento;
        celular.ram = ram ?? celular.ram;
        celular.cor = cor ?? celular.cor;
        celular.observacoes = observacoes ?? celular.observacoes;
        celular.valorCompra = valorCompra ?? celular.valorCompra;
        celular.dataCompra = dataCompra ?? celular.dataCompra;
        
        // Atualiza os campos antigos para compatibilidade
        celular.nome = nome ?? celular.nome;
        celular.quantidade = quantidade ?? celular.quantidade;
        celular.valor = valor ?? celular.valor;

        // Valida antes de salvar
        await celular.validate();
        const celularAtualizado = await celular.save();

        // Registrar atividade
        await registerActivity(
            'Celular atualizado',
            `${celularAtualizado.marca} ${celularAtualizado.modelo}`,
            celularAtualizado._id,
            'celular',
            req.user
        );

        res.status(200).json(celularAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar celular:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de celular inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Excluir um celular
// @route   DELETE /api/celulares/:id
// @access  Private
exports.deleteCelular = async (req, res) => {
    try {
        const celular = await Celular.findById(req.params.id);

        if (!celular) {
            return res.status(404).json({ message: 'Celular não encontrado' });
        }

        // Opcional: Verificar se o celular pertence ao usuário logado
        // if (celular.user.toString() !== req.user.id) {
        //     return res.status(401).json({ message: 'Não autorizado a excluir este celular' });
        // }

        const celularInfo = `${celular.marca} ${celular.modelo}`;
        const celularId = celular._id;

        await celular.deleteOne(); // Ou celular.remove() dependendo da versão do Mongoose

        // Registrar atividade
        await registerActivity(
            'Celular excluído',
            celularInfo,
            celularId,
            'celular',
            req.user
        );

        res.status(200).json({ message: 'Celular excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir celular:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de celular inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}; 