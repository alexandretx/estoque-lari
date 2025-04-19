const Celular = require('../models/Celular');
const Acessorio = require('../models/Acessorio');
const PlanoMovel = require('../models/PlanoMovel');

// @desc    Obter estatísticas do dashboard
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res) => {
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