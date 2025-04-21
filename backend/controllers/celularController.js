const Celular = require('../models/Celular');
const { registerActivity } = require('./activityController');

// @desc    Listar todos os celulares com paginação, busca e ordenação
// @route   GET /api/celulares
// @access  Private
exports.getCelulares = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const searchTerm = req.query.search || '';
        const sortBy = req.query.sortBy || 'marca';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        // Filtro de busca - Tratar armazenamento como string para busca
        let queryFilter = {};
        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i'); // Case-insensitive para campos String
            
            // Condições para campos String
            const stringFieldConditions = [
                { marca: regex },
                { modelo: regex },
                { imei: regex }, 
                { observacoes: regex },
                // Adicionar outros campos String relevantes para busca aqui
                // Ex: { cor: regex }
            ];

            // Condição para campo numérico 'armazenamento' (convertido para string)
            const numberAsStringCondition = {
                 $expr: { 
                    $regexMatch: { 
                        input: { $toString: "$armazenamento" }, // Converte armazenamento para string
                        regex: searchTerm, // Passa o termo como string para a regex dentro do $expr
                        options: "i" // Garante case-insensitivity na comparação regex
                    }
                } 
            };
            
            // Combina as condições
            queryFilter = {
                $or: [
                    ...stringFieldConditions,
                    numberAsStringCondition
                    // Adicionar aqui a condição para 'ram' se for número e precisar buscar
                    // { $expr: { $regexMatch: { input: { $toString: "$ram" }, regex: searchTerm, options: "i" } } }
                ]
            };
        }

        // Opções de ordenação
        const sortOptions = {};
        // Certifique-se que todos os campos usados em `sortBy` existem no Schema
        const validSortKeys = ['marca', 'modelo', 'imei', 'armazenamento', 'cor', 'createdAt', 'dataCompra', 'valorCompra', 'ram']; 
        if (validSortKeys.includes(sortBy)) {
            sortOptions[sortBy] = sortOrder;
        } else {
            console.warn(`Chave de ordenação inválida: ${sortBy}. Usando fallback para marca.`);
            sortOptions['marca'] = 1; // Fallback seguro
        }

        const totalCelulares = await Celular.countDocuments(queryFilter);

        const celulares = await Celular.find(queryFilter)
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
        // Log mais detalhado do erro
        console.error('Erro ao buscar celulares:', error.message);
        if (error.name === 'CastError') {
             console.error(`Detalhes CastError: Path: ${error.path}, Value: ${JSON.stringify(error.value)}, Kind: ${error.kind}`);
        } else if (error.code === 51049) { // Código de erro comum para problemas de $expr/$toString
             console.error('Erro potencial com $expr/$toString. Verifique a sintaxe da query e tipos de dados.', error);
        } else {
             console.error('Stack Trace:', error.stack);
        }
        
        res.status(500).json({ message: 'Erro interno do servidor ao processar a busca de celulares.' }); 
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