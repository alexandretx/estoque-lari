const Celular = require('../models/Celular');
const Acessorio = require('../models/Acessorio');
const PlanoMovel = require('../models/PlanoMovel');
const VivoCelular = require('../models/VivoCelular');
const VivoAcessorio = require('../models/VivoAcessorio');

// @desc    Obter estatísticas do dashboard
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        // Contar documentos em paralelo 
        const [
            totalCelularesDocs, 
            totalAcessoriosDocs,
            totalVivoCelularesDocs,
            totalVivoAcessoriosDocs
        ] = await Promise.all([
            // Contar o número total de documentos na coleção Celular
            Celular.countDocuments(),
            // Contar o número total de documentos na coleção Acessorio
            Acessorio.countDocuments(),
            // Contar o número total de celulares da Vivo
            VivoCelular.countDocuments(),
            // Contar o número total de acessórios da Vivo
            VivoAcessorio.countDocuments()
        ]);

        // Os resultados de countDocuments já são os números totais
        res.status(200).json({
            celulares: totalCelularesDocs,
            acessorios: totalAcessoriosDocs,
            vivoCelulares: totalVivoCelularesDocs,
            vivoAcessorios: totalVivoAcessoriosDocs,
            // Total de todos os itens para estatísticas gerais
            totalItens: totalCelularesDocs + totalAcessoriosDocs + totalVivoCelularesDocs + totalVivoAcessoriosDocs
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
        
        // Buscar celulares Vivo antigos
        const oldVivoCelulares = await VivoCelular.find({
            dataCompra: { $lte: dateLimit }
        }).select('marca modelo imei dataCompra');

        // Buscar acessórios Vivo antigos
        const oldVivoAcessorios = await VivoAcessorio.find({
            dataCompra: { $lte: dateLimit }
        }).select('tipo marca modelo dataCompra');
        
        res.status(200).json({ 
            oldCelulares, 
            oldAcessorios,
            oldVivoCelulares,
            oldVivoAcessorios
        });

    } catch (error) {
        console.error('Erro ao buscar itens antigos:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar itens antigos' });
    }
}; 