const mongoose = require('mongoose');

const PlanoMovelSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Por favor, informe o nome do plano'],
        trim: true,
        unique: true, // Geralmente nomes de planos são únicos
    },
    valor: {
        type: Number,
        required: [true, 'Por favor, informe o valor do plano'],
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

module.exports = mongoose.model('PlanoMovel', PlanoMovelSchema); 