import { Router } from 'express';
import {
  listBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/booksController.js';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, listBooks);
router.get('/:id', optionalAuth, getBookById);
router.post('/', requireAuth, requireRole('administrador'), createBook);
router.patch('/:id', requireAuth, requireRole('administrador'), updateBook);
router.delete('/:id', requireAuth, requireRole('administrador'), deleteBook);

export default router;
