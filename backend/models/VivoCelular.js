const mongoose = require('mongoose');

const vivoCelularSchema = mongoose.Schema({
    marca: {
        type: String,
        required: [true, 'Por favor, informe a marca']
    },
    modelo: {
        type: String,
        required: [true, 'Por favor, informe o modelo']
    },
    imei: {
        type: String
    },
    armazenamento: {
        type: String,
        required: [true, 'Por favor, informe o armazenamento']
    },
    memoriaRAM: {
        type: String
    },
    cor: {
        type: String
    },
    estado: {
        type: String,
        enum: ['Novo', 'Seminovo', 'Usado', 'Danificado'],
        default: 'Novo'
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
    acessorios: {
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

module.exports = mongoose.model('VivoCelular', vivoCelularSchema); 