require('dotenv').config(); // Carrega variáveis de ambiente do .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const celularRoutes = require('./routes/celularRoutes');
const acessorioRoutes = require('./routes/acessorioRoutes'); // Adicionado
const planoRoutes = require('./routes/planoRoutes'); // Adicionado
const dashboardRoutes = require('./routes/dashboardRoutes'); // Importar

// Importação das rotas da Vivo
const vivoDashboardRoutes = require('./routes/vivoDashboardRoutes');
const vivoCelularRoutes = require('./routes/vivoCelularRoutes');
const vivoAcessorioRoutes = require('./routes/vivoAcessorioRoutes');

const app = express();

// Middlewares essenciais
app.use(cors()); // Habilita CORS para permitir requisições do frontend
app.use(express.json()); // Permite que o Express entenda JSON no corpo das requisições

// Logger para desenvolvimento
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Conexão com o MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('Erro: String de conexão do MongoDB (MONGODB_URI) não definida no .env');
    process.exit(1); // Encerra a aplicação se a URI não estiver definida
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB conectado com sucesso.'))
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    });

// Rota de teste
app.get('/', (req, res) => {
    res.send('API do Sistema de Estoque está rodando!');
});

// --- Definição das Rotas da API ---
app.use('/api/auth', authRoutes);
app.use('/api/celulares', celularRoutes);
app.use('/api/acessorios', acessorioRoutes); // Adicionado
app.use('/api/planos', planoRoutes); // Adicionado
app.use('/api/dashboard', dashboardRoutes); // Usar

// Rotas da Vivo
app.use('/api/vivo', vivoDashboardRoutes);
app.use('/api/vivo/celulares', vivoCelularRoutes);
app.use('/api/vivo/acessorios', vivoAcessorioRoutes);

// Servir arquivos estáticos em produção
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

// --- Middleware de tratamento de erros --- (Pode ser adicionado depois)
// Exemplo: app.use(require('./middleware/errorMiddleware'));

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando no modo ${process.env.NODE_ENV} na porta ${PORT}`)); 