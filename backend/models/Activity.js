const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        trim: true
    },
    item: {
        type: String,
        required: true,
        trim: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    itemType: {
        type: String,
        enum: ['celular', 'acessorio', 'plano', 'user'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    userName: {
        type: String,
        required: false,
        trim: true
    }
}, {
    timestamps: true
});

// Método virtual para formatar o tempo de forma amigável
ActivitySchema.virtual('time').get(function() {
    const now = new Date();
    const createdAt = this.createdAt;
    const diffMs = now - createdAt;
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return 'agora mesmo';
    if (diffSec < 3600) return `há ${Math.floor(diffSec / 60)} minutos`;
    if (diffSec < 86400) return `há ${Math.floor(diffSec / 3600)} horas`;
    if (diffSec < 604800) return `há ${Math.floor(diffSec / 86400)} dias`;
    
    // Se for mais antigo que uma semana, mostra a data
    return createdAt.toLocaleDateString('pt-BR');
});

// Garantir que os campos virtuais sejam incluídos quando convertemos para JSON
ActivitySchema.set('toJSON', { virtuals: true });
ActivitySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Activity', ActivitySchema); 
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        trim: true
    },
    item: {
        type: String,
        required: true,
        trim: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    itemType: {
        type: String,
        enum: ['celular', 'acessorio', 'plano', 'user'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    userName: {
        type: String,
        required: false,
        trim: true
    }
}, {
    timestamps: true
});

// Método virtual para formatar o tempo de forma amigável
ActivitySchema.virtual('time').get(function() {
    const now = new Date();
    const createdAt = this.createdAt;
    const diffMs = now - createdAt;
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return 'agora mesmo';
    if (diffSec < 3600) return `há ${Math.floor(diffSec / 60)} minutos`;
    if (diffSec < 86400) return `há ${Math.floor(diffSec / 3600)} horas`;
    if (diffSec < 604800) return `há ${Math.floor(diffSec / 86400)} dias`;
    
    // Se for mais antigo que uma semana, mostra a data
    return createdAt.toLocaleDateString('pt-BR');
});

// Garantir que os campos virtuais sejam incluídos quando convertemos para JSON
ActivitySchema.set('toJSON', { virtuals: true });
ActivitySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Activity', ActivitySchema); 