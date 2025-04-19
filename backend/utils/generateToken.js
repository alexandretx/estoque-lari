const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;

    if (!secret) {
        console.error('Erro: Segredo JWT (JWT_SECRET) não definido no .env');
        throw new Error('Configuração de JWT incompleta no servidor');
    }
    if (!expiresIn) {
        console.error('Erro: Duração do JWT (JWT_EXPIRES_IN) não definida no .env');
        throw new Error('Configuração de JWT incompleta no servidor');
    }

    return jwt.sign({ id }, secret, {
        expiresIn: expiresIn,
    });
};

module.exports = generateToken; 