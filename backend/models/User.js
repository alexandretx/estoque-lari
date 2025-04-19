const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Por favor, informe o nome'],
    },
    email: {
        type: String,
        required: [true, 'Por favor, informe o email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Por favor, use um email válido',
        ],
    },
    senha: {
        type: String,
        required: [true, 'Por favor, informe a senha'],
        minlength: 6,
        select: false, // Não retorna a senha por padrão nas buscas
    },
    // createdAt e updatedAt são adicionados automaticamente por timestamps: true
}, {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
});

// Middleware pré-save para criptografar a senha antes de salvar
UserSchema.pre('save', async function (next) {
    // Só criptografa a senha se ela foi modificada (ou é nova)
    if (!this.isModified('senha')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

// Método para comparar a senha informada com a senha no banco
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.senha);
};

module.exports = mongoose.model('User', UserSchema); 