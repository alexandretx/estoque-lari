const mongoose = require('mongoose');

// Definindo o Schema para Acessórios da Vivo
const VivoAcessorioSchema = new mongoose.Schema({
  marca: {
    type: String,
    required: [true, 'Marca é obrigatória'],
    trim: true,
  },
  modelo: {
    type: String,
    required: [true, 'Modelo é obrigatório'],
    trim: true,
  },
  tipo: {
    type: String,
    required: [true, 'Tipo é obrigatório'],
    trim: true,
  },
  valorProduto: {
    type: Number,
    min: 0,
  },
  observacoes: {
    type: String,
    trim: true,
  },
  dataCompra: {
    type: Date,
  },
  // Manter compatibilidade se necessário
  // nome: String,
  // cor: String,
  // quantidade: Number,
  // valor: Number,
  
  // Referência ao usuário se aplicável
  // user: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'User',
  //   // required: true
  // },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: { createdAt: false, updatedAt: 'updatedAt' }
});

// Middleware para atualizar 'updatedAt'
VivoAcessorioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

VivoAcessorioSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('VivoAcessorio', VivoAcessorioSchema); 