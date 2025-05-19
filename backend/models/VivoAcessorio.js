const mongoose = require('mongoose');

const VivoAcessorioSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: [true, 'Por favor, informe o tipo do acessório'],
        trim: true,
    },
    marca: {
        type: String,
        required: [true, 'Por favor, informe a marca do acessório'],
        trim: true,
    },
    modelo: {
        type: String,
        required: [true, 'Por favor, informe o modelo do acessório'],
        trim: true,
    },
    cor: {
        type: String,
        trim: true,
    },
    valorCompra: {
        type: Number,
        min: [0, 'O valor não pode ser negativo'],
    },
    valorVenda: {
        type: Number,
        min: [0, 'O valor não pode ser negativo'],
    },
    dataCompra: {
        type: Date,
    },
    quantidade: {
        type: Number,
        min: [0, 'A quantidade não pode ser negativa'],
        default: 1,
    },
    status: {
        type: String,
        enum: ['disponível', 'vendido', 'reservado'],
        default: 'disponível'
    },
    observacoes: {
        type: String,
        trim: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('VivoAcessorio', VivoAcessorioSchema); 