const mongoose = require('mongoose');

const vivoCelularSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    marca: {
      type: String,
      required: [true, 'Por favor, adicione a marca'],
    },
    modelo: {
      type: String,
      required: [true, 'Por favor, adicione o modelo'],
    },
    imei: {
      type: String,
      required: [true, 'Por favor, adicione o IMEI'],
    },
    armazenamento: {
      type: String,
      required: [true, 'Por favor, adicione o armazenamento'],
    },
    ram: {
      type: String,
      required: [true, 'Por favor, adicione a memória RAM'],
    },
    cor: {
      type: String,
      required: [true, 'Por favor, adicione a cor'],
    },
    observacoes: {
      type: String,
      default: '',
    },
    valorCompra: {
      type: Number,
      required: [true, 'Por favor, adicione o valor de compra'],
    },
    dataCompra: {
      type: Date,
      required: [true, 'Por favor, adicione a data de compra'],
    },
    vendido: {
      type: Boolean,
      default: false,
    },
    valorVenda: {
      type: Number,
      default: 0,
    },
    dataVenda: {
      type: Date,
    },
    cliente: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('VivoCelular', vivoCelularSchema); 