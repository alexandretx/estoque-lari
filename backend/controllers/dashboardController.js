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

// @desc    Verificar se existem itens com mais de 180 dias
// @route   GET /api/dashboard/check-old-items
// @access  Private
exports.checkOldItems = async (req, res) => {
    try {
        const daysAgo = 180;
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - daysAgo);

        // Verifica se existe algum celular com dataCompra <= dateLimit
        const oldCelular = await Celular.findOne({
            dataCompra: { $lte: dateLimit }
        });

        // Se já encontrou um celular antigo, não precisa verificar acessórios
        if (oldCelular) {
            return res.status(200).json({ hasOldItems: true });
        }

        // Verifica se existe algum acessório com dataCompra <= dateLimit
        const oldAcessorio = await Acessorio.findOne({
            dataCompra: { $lte: dateLimit }
        });
        
        // Retorna true se encontrou um acessório antigo, senão false
        res.status(200).json({ hasOldItems: !!oldAcessorio });

    } catch (error) {
        console.error('Erro ao verificar itens antigos:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao verificar itens antigos' });
    }
}; 