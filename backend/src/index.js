const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/documents', require('./routes/documents.routes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Conexión a la base de datos e inicio del servidor
const startServer = async () => {
  try {
    // Probar la conexión a la base de datos
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // NO usar sequelize.sync() - usar migraciones en su lugar
    // Para correr migraciones: npm run migrate
    // await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Recuerda ejecutar las migraciones: npm run migrate');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Schema: csv_app (NO public)`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
