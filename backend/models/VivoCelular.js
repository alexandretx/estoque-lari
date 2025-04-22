const mongoose = require('mongoose');

// Definindo o Schema para Celulares da Vivo
const VivoCelularSchema = new mongoose.Schema({
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
  imei: {
    type: String,
    trim: true,
    // Adicionar validação de unicidade se necessário para Vivo
    // unique: true, 
    // sparse: true, // Permite múltiplos nulos/vazios se unique for true
  },
  armazenamento: {
    type: Number, // Mantendo como Number
    min: 0,
  },
  ram: {
    type: Number,
    min: 0,
  },
  cor: {
    type: String,
    trim: true,
  },
  observacoes: {
    type: String,
    trim: true,
  },
  valorCompra: {
    type: Number,
    min: 0,
  },
  dataCompra: {
    type: Date,
  },
  // Manter compatibilidade com campos antigos se necessário, ou remover
  // nome: String, 
  // quantidade: Number,
  // valor: Number, 
  
  // Adicionar referência ao usuário se a lógica de usuário for relevante aqui
  // user: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'User',
  //   // required: true // Tornar obrigatório se necessário
  // },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: { createdAt: false, updatedAt: 'updatedAt' } // Atualiza apenas updatedAt
});

// Middleware para atualizar 'updatedAt' antes de salvar
VivoCelularSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware para atualizar 'updatedAt' em operações de update
VivoCelularSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Criar índice para IMEI se for único
// VivoCelularSchema.index({ imei: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('VivoCelular', VivoCelularSchema); 