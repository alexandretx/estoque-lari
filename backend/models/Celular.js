const mongoose = require('mongoose');

const CelularSchema = new mongoose.Schema({
    // Novos campos (formulário frontend)
    marca: {
        type: String,
        required: [true, 'Por favor, informe a marca do celular'],
        trim: true,
    },
    modelo: {
        type: String,
        required: [true, 'Por favor, informe o modelo do celular'],
        trim: true,
    },
    imei: {
        type: String,
        required: [true, 'Por favor, informe o IMEI do celular'],
        trim: true,
    },
    armazenamento: {
        type: Number,
        min: [0, 'O armazenamento não pode ser negativo'],
    },
    ram: {
        type: Number,
        min: [0, 'A RAM não pode ser negativa'],
    },
    observacoes: {
        type: String,
        trim: true,
    },
    valorCompra: {
        type: Number,
        required: [true, 'Por favor, informe o valor de compra do celular'],
        min: [0, 'O valor não pode ser negativo'],
    },
    dataCompra: {
        type: Date,
    },
    
    // Campos antigos (mantemos como opcionais para compatibilidade)
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
    // Referência ao usuário que cadastrou (opcional, mas útil)
    // user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Celular', CelularSchema); 