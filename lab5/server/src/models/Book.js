import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título del eBook es obligatorio'],
      trim: true,
      maxlength: [200, 'El título no puede superar 200 caracteres']
    },
    author: {
      type: String,
      required: [true, 'El autor es obligatorio'],
      trim: true,
      maxlength: [150, 'El autor no puede superar 150 caracteres']
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [2000, 'La descripción no puede superar 2000 caracteres']
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true,
      index: true
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo']
    },
    stock: {
      type: Number,
      required: [true, 'El stock de licencias es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0
    },
    coverImageUrl: {
      type: String,
      required: [true, 'La URL de portada es obligatoria'],
      trim: true,
      match: [/^https?:\/\/.+/i, 'La URL de portada debe iniciar con http:// o https://']
    },
    downloadUrl: {
      type: String,
      required: [true, 'La URL de descarga del eBook es obligatoria'],
      trim: true,
      match: [/^https?:\/\/.+/i, 'La URL de descarga debe iniciar con http:// o https://']
    },
    format: {
      type: String,
      default: 'PDF / EPUB',
      trim: true
    },
    pages: {
      type: Number,
      min: 1,
      default: 250
    }
  },
  {
    timestamps: true,
    collection: 'books'
  }
);

bookSchema.index({ title: 'text', author: 'text', description: 'text' });

bookSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

export const Book = mongoose.model('Book', bookSchema);
