const mongoose = require('mongoose');

const VivoAcessorioSchema = new mongoose.Schema({
    // Informações básicas do acessório
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
    // Detalhes físicos
    cor: {
        type: String,
        trim: true,
    },
    material: {
        type: String,
        trim: true,
    },
    // Informações de compra e valor
    valorCompra: {
        type: Number,
        required: [true, 'Por favor, informe o valor de compra do acessório'],
        min: [0, 'O valor não pode ser negativo'],
    },
    dataCompra: {
        type: Date,
    },
    // Outros detalhes
    observacoes: {
        type: String,
        trim: true,
    },
    // Campos específicos para Vivo
    statusVivo: {
        type: String,
        enum: ['disponível', 'vendido', 'reservado', 'manutenção'],
        default: 'disponível'
    },
    lojaVivo: {
        type: String,
        trim: true,
        default: 'Principal'
    },
    quantidade: {
        type: Number,
        min: [0, 'A quantidade não pode ser negativa'],
        default: 1,
    },
    // Referência ao usuário que cadastrou (opcional)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('VivoAcessorio', VivoAcessorioSchema); 