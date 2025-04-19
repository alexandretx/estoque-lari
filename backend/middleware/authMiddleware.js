const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rotas
exports.protect = async (req, res, next) => {
    let token;

    // Verifica se o token está no header Authorization e começa com Bearer
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extrai o token (remove "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // Verifica o token usando o segredo
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Encontra o usuário pelo ID contido no token e anexa ao request
            // Exclui a senha do objeto user anexado
            req.user = await User.findById(decoded.id).select('-senha');

            if (!req.user) {
                return res.status(401).json({ message: 'Não autorizado, usuário não encontrado' });
            }

            next(); // Prossegue para o próximo middleware ou rota
        } catch (error) {
            console.error('Erro na verificação do token:', error);
            res.status(401).json({ message: 'Não autorizado, token falhou ou expirou' });
        }
    }

    // Se não houver token no header
    if (!token) {
        res.status(401).json({ message: 'Não autorizado, nenhum token fornecido' });
    }
};

// Exemplo de middleware para verificar permissões (opcional)
// exports.authorize = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) { // Supondo que o modelo User tenha um campo 'role'
//             return res.status(403).json({ message: `Usuário com papel ${req.user.role} não autorizado a acessar esta rota` });
//         }
//         next();
//     };
// }; 