const Celular = require('../models/Celular');
const Acessorio = require('../models/Acessorio');
const PlanoMovel = require('../models/PlanoMovel');

// @desc    Obter estatísticas do dashboard
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        // Contar documentos em paralelo
        const [totalCelularesDocs, totalAcessoriosDocs, totalPlanos] = await Promise.all([
            // Contar o número total de documentos na coleção Celular
            Celular.countDocuments(),
            // Contar o número total de documentos na coleção Acessorio
            Acessorio.countDocuments(),
            // Contagem simples de planos (mantém a mesma lógica)
            PlanoMovel.countDocuments()
        ]);

        // Os resultados de countDocuments já são os números totais
        res.status(200).json({
            celulares: totalCelularesDocs,     // Retorna a contagem de documentos
            acessorios: totalAcessoriosDocs,   // Retorna a contagem de documentos
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