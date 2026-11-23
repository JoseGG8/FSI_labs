import { Book } from '../models/Book.js';
import { AppError } from '../middleware/errorHandler.js';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function serializeBook(bookDoc, isAdmin) {
  const obj = bookDoc.toJSON ? bookDoc.toJSON() : { ...bookDoc };
  if (!isAdmin) {
    delete obj.downloadUrl;
  }
  return obj;
}

export async function listBooks(req, res, next) {
  try {
    const { q, category, minPrice, maxPrice, inStock, sort } = req.query;
    const filter = {};

    if (q && typeof q === 'string' && q.trim()) {
      const regex = new RegExp(escapeRegex(q.trim()), 'i');
      filter.$or = [{ title: regex }, { author: regex }, { description: regex }];
    }

    if (category && typeof category === 'string' && category.trim() && category !== 'all') {
      filter.category = category.trim();
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        const min = Number(minPrice);
        if (!Number.isNaN(min) && min >= 0) filter.price.$gte = min;
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        const max = Number(maxPrice);
        if (!Number.isNaN(max) && max >= 0) filter.price.$lte = max;
      }
      if (Object.keys(filter.price).length === 0) {
        delete filter.price;
      }
    }

    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'title') sortOption = { title: 1 };

    const [books, categories] = await Promise.all([
      Book.find(filter).sort(sortOption),
      Book.distinct('category')
    ]);

    const isAdmin = req.user?.role === 'administrador';

    res.json({
      ok: true,
      total: books.length,
      categories: categories.sort(),
      books: books.map((b) => serializeBook(b, isAdmin))
    });
  } catch (error) {
    next(error);
  }
}

export async function getBookById(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      throw new AppError('eBook no encontrado', 404);
    }
    const isAdmin = req.user?.role === 'administrador';
    res.json({
      ok: true,
      book: serializeBook(book, isAdmin)
    });
  } catch (error) {
    next(error);
  }
}

export async function createBook(req, res, next) {
  try {
    const {
      title,
      author,
      description,
      category,
      price,
      stock,
      coverImageUrl,
      downloadUrl,
      format,
      pages
    } = req.body || {};

    const book = await Book.create({
      title,
      author,
      description,
      category,
      price,
      stock,
      coverImageUrl,
      downloadUrl,
      format,
      pages
    });

    res.status(201).json({
      ok: true,
      message: 'eBook creado correctamente',
      book
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBook(req, res, next) {
  try {
    const allowedFields = [
      'title',
      'author',
      'description',
      'category',
      'price',
      'stock',
      'coverImageUrl',
      'downloadUrl',
      'format',
      'pages'
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body && req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const book = await Book.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!book) {
      throw new AppError('eBook no encontrado', 404);
    }

    res.json({
      ok: true,
      message: 'eBook actualizado correctamente',
      book
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteBook(req, res, next) {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      throw new AppError('eBook no encontrado', 404);
    }
    res.json({
      ok: true,
      message: 'eBook eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
}
