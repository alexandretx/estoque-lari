const mongoose = require('mongoose');

const VivoCelularSchema = new mongoose.Schema({
    // Informações básicas do celular
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
    cor: {
        type: String,
        trim: true,
    },
    // Informações de compra e valor
    valorCompra: {
        type: Number,
        required: [true, 'Por favor, informe o valor de compra do celular'],
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

module.exports = mongoose.model('VivoCelular', VivoCelularSchema);