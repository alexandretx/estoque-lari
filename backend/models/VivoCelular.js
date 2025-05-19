const mongoose = require('mongoose');

const VivoCelularSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ['Guardado', 'Vitrine'],
        default: 'Guardado'
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

module.exports = mongoose.model('VivoCelular', VivoCelularSchema); 