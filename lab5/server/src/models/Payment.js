import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'El ID del pedido es obligatorio'],
      index: true
    },
    provider: {
      type: String,
      enum: ['paypal'],
      default: 'paypal',
      required: true
    },
    providerOrderId: {
      type: String,
      required: [true, 'El ID de orden del proveedor es obligatorio'],
      unique: true,
      trim: true
    },
    captureId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'El monto del pago es obligatorio'],
      min: [0, 'El monto no puede ser negativo']
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['creado', 'aprobado', 'capturado', 'fallido', 'reembolsado'],
        message: 'Estado de pago inválido'
      },
      default: 'creado',
      index: true
    },
    rawResponse: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true,
    collection: 'payments'
  }
);

paymentSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

export const Payment = mongoose.model('Payment', paymentSchema);
