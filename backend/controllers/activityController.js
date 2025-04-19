const Activity = require('../models/Activity');

// Serviço para registrar atividades no sistema
exports.registerActivity = async (action, item, itemId, itemType, user = null) => {
    try {
        const activity = new Activity({
            action,
            item,
            itemId,
            itemType,
            user: user?._id,
            userName: user?.nome || 'Sistema'
        });
        
        await activity.save();
        return activity;
    } catch (error) {
        console.error('Erro ao registrar atividade:', error);
        // Não lançamos o erro para não interromper o fluxo principal
        return null;
    }
};

// @desc    Buscar atividades recentes
// @route   GET /api/dashboard/activities
// @access  Private
exports.getRecentActivities = async (req, res) => {
    try {
        // Buscar as últimas 10 atividades, ordenadas pela data mais recente
        const activities = await Activity
            .find()
            .sort({ createdAt: -1 })
            .limit(10);
            
        // Formatar a resposta para o frontend
        const formattedActivities = activities.map(activity => ({
            action: activity.action,
            item: activity.item,
            time: activity.time, // Campo virtual calculado
            itemType: activity.itemType,
            itemId: activity.itemId,
            userName: activity.userName
        }));
        
        res.status(200).json(formattedActivities);
    } catch (error) {
        console.error('Erro ao buscar atividades recentes:', error);
        res.status(500).json({ message: 'Erro ao buscar atividades recentes' });
    }
}; 