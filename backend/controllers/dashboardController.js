const Celular = require('../models/Celular');
const Acessorio = require('../models/Acessorio');
const PlanoMovel = require('../models/PlanoMovel');

// @desc    Obter estatísticas do dashboard
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        // Contar documentos em paralelo
        const [totalCelulares, totalAcessorios, totalPlanos] = await Promise.all([
            // Aggregate para somar a quantidade de todos os celulares
            Celular.aggregate([
                { $group: { _id: null, total: { $sum: '$quantidade' } } }
            ]),
            // Aggregate para somar a quantidade de todos os acessórios
            Acessorio.aggregate([
                { $group: { _id: null, total: { $sum: '$quantidade' } } }
            ]),
            // Contagem simples de planos
            PlanoMovel.countDocuments()
        ]);

        // Extrair os totais dos resultados do aggregate (ou 0 se não houver itens)
        const quantidadeCelulares = totalCelulares.length > 0 ? totalCelulares[0].total : 0;
        const quantidadeAcessorios = totalAcessorios.length > 0 ? totalAcessorios[0].total : 0;

        res.status(200).json({
            celulares: quantidadeCelulares,
            acessorios: quantidadeAcessorios,
            planos: totalPlanos
        });

    } catch (error) {
        console.error('Erro ao buscar estatísticas do dashboard:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar estatísticas' });
    }
};

// @desc    Listar itens com mais de 180 dias (modificado)
// @route   GET /api/dashboard/old-items // Rota renomeada para clareza
// @access  Private
exports.getOldItems = async (req, res) => {
    try {
        const daysAgo = 180;
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - daysAgo);

        // Buscar celulares antigos, selecionando campos relevantes
        const oldCelulares = await Celular.find({
            dataCompra: { $lte: dateLimit }
        }).select('marca modelo imei dataCompra'); // Selecionar campos necessários

        // Buscar acessórios antigos, selecionando campos relevantes
        const oldAcessorios = await Acessorio.find({
            dataCompra: { $lte: dateLimit }
        }).select('marca modelo tipo dataCompra'); // Selecionar campos necessários
        
        res.status(200).json({ oldCelulares, oldAcessorios });

    } catch (error) {
        console.error('Erro ao buscar itens antigos:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar itens antigos' });
    }
}; 