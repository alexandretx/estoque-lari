const mongoose = require('mongoose');

const vivoAcessorioSchema = mongoose.Schema(
  {
    tipo: {
      type: String,
      required: [true, 'Por favor informe o tipo de acessório']
    },
    marca: {
      type: String,
      required: [true, 'Por favor informe a marca']
    },
    modelo: {
      type: String,
      required: [true, 'Por favor informe o modelo']
    },
    valorCompra: {
      type: Number,
      required: [true, 'Por favor informe o valor de compra']
    },
    dataCompra: {
      type: Date,
      required: [true, 'Por favor informe a data de compra']
    },
    observacoes: {
      type: String
    },
    status: {
      type: String,
      enum: ['Em estoque', 'Vendido', 'Reservado', 'Em manutenção'],
      default: 'Em estoque'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('VivoAcessorio', vivoAcessorioSchema); 