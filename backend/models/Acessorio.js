const mongoose = require('mongoose');

const AcessorioSchema = new mongoose.Schema({
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
    tipo: {
        type: String,
        required: [true, 'Por favor, informe o tipo do acessório'],
        trim: true,
    },
    valorProduto: {
        type: Number,
        min: [0, 'O valor não pode ser negativo'],
    },
    observacoes: {
        type: String,
        trim: true,
    },
    // Mantemos os campos antigos como opcionais para compatibilidade
    nome: {
        type: String,
        trim: true,
    },
    cor: {
        type: String,
        trim: true,
    },
    quantidade: {
        type: Number,
        min: [0, 'A quantidade não pode ser negativa'],
        default: 0,
    },
    valor: {
        type: Number,
        min: [0, 'O valor não pode ser negativo'],
    },
    // user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Acessorio', AcessorioSchema); 