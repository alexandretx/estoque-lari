const mongoose = require('mongoose');

const vivoAcessorioSchema = mongoose.Schema({
    marca: {
        type: String,
        required: [true, 'Por favor, informe a marca']
    },
    modelo: {
        type: String,
        required: [true, 'Por favor, informe o modelo']
    },
    tipo: {
        type: String,
        required: [true, 'Por favor, informe o tipo de acessório'],
        enum: ['Fone de Ouvido', 'Carregador', 'Capa', 'Película', 'Cabo USB', 'Outro']
    },
    cor: {
        type: String
    },
    material: {
        type: String
    },
    valorCompra: {
        type: Number,
        required: [true, 'Por favor, informe o valor de compra']
    },
    precoVenda: {
        type: Number
    },
    dataCompra: {
        type: Date,
        default: Date.now
    },
    dataVenda: {
        type: Date
    },
    quantidadeEstoque: {
        type: Number,
        default: 1
    },
    vendido: {
        type: Boolean,
        default: false
    },
    observacoes: {
        type: String
    },
    cliente: {
        nome: String,
        telefone: String,
        email: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VivoAcessorio', vivoAcessorioSchema); 