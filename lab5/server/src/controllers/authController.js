import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { signAuthToken } from '../middleware/auth.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      throw new AppError('El nombre es obligatorio y debe tener al menos 2 caracteres', 400);
    }
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      throw new AppError('Debes proporcionar un correo electrónico válido', 400);
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new AppError('La contraseña es obligatoria y debe tener al menos 6 caracteres', 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw new AppError('Ya existe una cuenta registrada con ese correo electrónico', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // El registro público siempre asigna el rol 'cliente' para evitar escalada de privilegios
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'cliente'
    });

    const token = signAuthToken(user);

    res.status(201).json({
      ok: true,
      message: 'Cuenta creada correctamente',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      throw new AppError('Debes ingresar correo electrónico y contraseña', 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const token = signAuthToken(user);

    res.json({
      ok: true,
      message: 'Inicio de sesión exitoso',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({
    ok: true,
    user: req.user
  });
}
