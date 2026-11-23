import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [100, 'El nombre no puede superar 100 caracteres']
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Formato de correo electrónico inválido']
    },
    passwordHash: {
      type: String,
      required: [true, 'El hash de la contraseña es obligatorio']
    },
    role: {
      type: String,
      enum: {
        values: ['cliente', 'administrador'],
        message: 'El rol debe ser "cliente" o "administrador"'
      },
      default: 'cliente'
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

export const User = mongoose.model('User', userSchema);
