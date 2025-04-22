// Controller para Celulares da Vivo

const VivoCelular = require('../models/VivoCelular');
const { registerActivity } = require('./activityController');

// @desc    Listar todos os celulares Vivo com paginação, busca e ordenação
// @route   GET /api/vivo/celulares
// @access  Private
exports.getVivoCelulares = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const searchTerm = req.query.search || '';
        const sortBy = req.query.sortBy || 'marca';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        let queryFilter = {};
        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            const stringFieldConditions = [
                { marca: regex },
                { modelo: regex },
                { imei: regex }, 
                { observacoes: regex },
                { cor: regex }
            ];
            const numberAsStringCondition = {
                 $expr: { 
                    $regexMatch: { 
                        input: { $toString: "$armazenamento" }, 
                        regex: searchTerm, 
                        options: "i" 
                    }
                } 
            };
             const ramCondition = {
                 $expr: { 
                    $regexMatch: { 
                        input: { $toString: "$ram" }, 
                        regex: searchTerm, 
                        options: "i" 
                    }
                } 
            };
            queryFilter = {
                $or: [
                    ...stringFieldConditions,
                    numberAsStringCondition,
                    ramCondition
                ]
            };
        }

        const sortOptions = {};
        const validSortKeys = ['marca', 'modelo', 'imei', 'armazenamento', 'cor', 'createdAt', 'dataCompra', 'valorCompra', 'ram']; 
        if (validSortKeys.includes(sortBy)) {
            sortOptions[sortBy] = sortOrder;
        } else {
            sortOptions['marca'] = 1;
        }

        const totalCelulares = await VivoCelular.countDocuments(queryFilter);

        const celulares = await VivoCelular.find(queryFilter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            celulares,
            currentPage: page,
            totalPages: Math.ceil(totalCelulares / limit),
            totalCelulares
        });
    } catch (error) {
        console.error('Erro ao buscar celulares Vivo:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor ao processar a busca de celulares Vivo.' }); 
    }
};

// @desc    Buscar um celular Vivo específico por ID
// @route   GET /api/vivo/celulares/:id
// @access  Private
exports.getVivoCelularById = async (req, res) => {
    try {
        const celular = await VivoCelular.findById(req.params.id);
        if (!celular) {
            return res.status(404).json({ message: 'Celular Vivo não encontrado' });
        }
        res.status(200).json(celular);
    } catch (error) {
        console.error('Erro ao buscar celular Vivo por ID:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de celular Vivo inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Cadastrar um novo celular Vivo
// @route   POST /api/vivo/celulares
// @access  Private
exports.createVivoCelular = async (req, res) => {
    const { 
        marca, modelo, imei, armazenamento, ram, cor, observacoes, valorCompra, dataCompra
    } = req.body;

    try {
        const celular = await VivoCelular.create({
            marca,
            modelo,
            imei,
            armazenamento,
            ram,
            cor,
            observacoes,
            valorCompra,
            dataCompra,
            // user: req.user.id // Se necessário
        });

        // Registrar atividade específica para Vivo
        await registerActivity(
            'Celular Vivo adicionado', // Ação específica
            `${marca} ${modelo}`,
            celular._id,
            'vivo-celular', // Tipo específico
            req.user // Passar o usuário logado
        );

        res.status(201).json(celular);
    } catch (error) {
        console.error('Erro ao cadastrar celular Vivo:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            // Estrutura de erro para o frontend { field: message }
            const errors = {};
            Object.values(error.errors).forEach(err => { errors[err.path] = err.message; });
            return res.status(400).json({ message: messages.join(', '), errors });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// @desc    Atualizar um celular Vivo
// @route   PUT /api/vivo/celulares/:id
// @access  Private
exports.updateVivoCelular = async (req, res) => {
    const { 
        marca, modelo, imei, armazenamento, ram, cor, observacoes, valorCompra, dataCompra
    } = req.body;

    try {
        let celular = await VivoCelular.findById(req.params.id);
        if (!celular) {
            return res.status(404).json({ message: 'Celular Vivo não encontrado' });
        }

        // Atualizar campos (nullish coalescing para permitir limpar campos não obrigatórios)
        celular.marca = marca ?? celular.marca;
        celular.modelo = modelo ?? celular.modelo;
        celular.imei = imei ?? celular.imei;
        celular.armazenamento = armazenamento ?? celular.armazenamento;
        celular.ram = ram ?? celular.ram;
        celular.cor = cor ?? celular.cor;
        celular.observacoes = observacoes ?? celular.observacoes;
        celular.valorCompra = valorCompra ?? celular.valorCompra;
        celular.dataCompra = dataCompra ?? celular.dataCompra;

        await celular.validate();
        const celularAtualizado = await celular.save();

        // Registrar atividade
        await registerActivity(
            'Celular Vivo atualizado',
            `${celularAtualizado.marca} ${celularAtualizado.modelo}`,
            celularAtualizado._id,
            'vivo-celular',
            req.user
        );

        res.status(200).json(celularAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar celular Vivo:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            const errors = {};
            Object.values(error.errors).forEach(err => { errors[err.path] = err.message; });
            return res.status(400).json({ message: messages.join(', '), errors });
        }
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de celular Vivo inválido' });
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
            return res.status(404).json({ message: 'Celular Vivo não encontrado' });
        }

        const celularInfo = `${celular.marca} ${celular.modelo}`;
        const celularId = celular._id;

        await celular.deleteOne();

        // Registrar atividade
        await registerActivity(
            'Celular Vivo excluído',
            celularInfo,
            celularId,
            'vivo-celular',
            req.user
        );

        res.status(200).json({ message: 'Celular Vivo excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir celular Vivo:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID de celular Vivo inválido' });
        }
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}; 