const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/email.service');

// Registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, confirmarPassword, rol } = req.body;

    // Validación
    if (!nombre || !email || !password || !confirmarPassword) {
      return res.status(400).json({ 
        error: 'All fields are required: nombre, email, password, confirmarPassword' 
      });
    }

    if (password !== confirmarPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Compruebe si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Validar rol
    const validRoles = ['user', 'admin'];
    const userRole = rol && validRoles.includes(rol) ? rol : 'user';

    // Generar token de verificación (24 horas)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Crear usuario
    const user = await User.create({
      nombre,
      email,
      password,
      rol: userRole,
      emailVerified: false,
      verificationToken,
      verificationTokenExpires
    });

    // Enviar email de verificación
    await sendVerificationEmail(user.email, user.nombre, verificationToken);

    res.status(201).json({
      message: 'Usuario registrado. Por favor verifica tu correo electrónico para activar tu cuenta.',
      email: user.email,
      requiresVerification: true
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verificar que el correo electrónico esté confirmado
    if (!user.emailVerified) {
      return res.status(403).json({ 
        error: 'Por favor verifica tu correo electrónico antes de iniciar sesión',
        requiresVerification: true
      });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Establecer cookie httpOnly
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Cierre de sesión
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: 'Logout successful' });
});

// Verificar correo electrónico
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Buscar usuario con el token
    const user = await User.findOne({
      where: {
        verificationToken: token
      }
    });

    if (!user) {
      return res.status(400).json({ 
        error: 'Token de verificación inválido o expirado' 
      });
    }

    // Verificar si el token ha expirado
    if (user.verificationTokenExpires < new Date()) {
      return res.status(400).json({ 
        error: 'El token de verificación ha expirado. Por favor solicita uno nuevo.' 
      });
    }

    // Activar la cuenta
    user.emailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    res.json({ 
      message: '¡Correo verificado exitosamente! Ya puedes iniciar sesión.',
      success: true
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Error al verificar el correo' });
  }
});

module.exports = router;
