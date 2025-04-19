const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Registrar um novo usuário
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        // Verifica se o usuário já existe
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe com este email' });
        }

        // Cria o novo usuário (a senha será criptografada pelo middleware pré-save no modelo)
        const user = await User.create({
            nome,
            email,
            senha,
        });

        // Gera o token e retorna os dados do usuário (sem a senha)
        const token = generateToken(user._id);
        res.status(201).json({
            _id: user._id,
            nome: user.nome,
            email: user.email,
            token: token,
        });

    } catch (error) {
        console.error('Erro no registro:', error);
        // Verifica se é um erro de validação do Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Erro interno do servidor ao registrar usuário' });
    }
};

// @desc    Autenticar usuário e obter token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verifica se o email e a senha foram fornecidos
        if (!email || !senha) {
            return res.status(400).json({ message: 'Por favor, forneça email e senha' });
        }

        // Procura o usuário pelo email e inclui a senha na busca
        const user = await User.findOne({ email }).select('+senha');

        // Verifica se o usuário existe e se a senha está correta
        if (user && (await user.matchPassword(senha))) {
            // Gera o token e retorna os dados do usuário
            const token = generateToken(user._id);
            res.json({
                _id: user._id,
                nome: user.nome,
                email: user.email,
                token: token,
            });
        } else {
            res.status(401).json({ message: 'Email ou senha inválidos' });
        }

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao fazer login' });
    }
};

// @desc    Obter dados do usuário logado
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    // O usuário é adicionado ao req pelo middleware de autenticação (protect)
    // Buscamos novamente para garantir os dados mais recentes (sem a senha)
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({
            _id: user._id,
            nome: user.nome,
            email: user.email,
            // Adicione outros campos que desejar retornar aqui
        });
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}; 