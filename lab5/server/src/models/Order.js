import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      trim: true
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La cantidad mínima por libro es 1']
    },
    downloadUrl: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    recipientName: { type: String, trim: true },
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    postalCode: { type: String, trim: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario del pedido es obligatorio'],
      index: true
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'El pedido debe contener al menos un eBook'
      }
    },
    total: {
      type: Number,
      required: [true, 'El total es obligatorio'],
      min: [0, 'El total no puede ser negativo']
    },
    emailDelivery: {
      type: String,
      required: [true, 'El correo de entrega digital es obligatorio'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Formato de correo de entrega inválido']
    },
    shippingAddress: {
      type: shippingAddressSchema,
      default: undefined
    },
    status: {
      type: String,
      enum: {
        values: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
        message: 'Estado de pedido inválido'
      },
      default: 'pendiente',
      index: true
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pendiente', 'pagado', 'fallido', 'reembolsado'],
        message: 'Estado de pago inválido'
      },
      default: 'pendiente',
      index: true
    }
  },
  {
    timestamps: true,
    collection: 'orders'
  }
);

orderSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

export const Order = mongoose.model('Order', orderSchema);
