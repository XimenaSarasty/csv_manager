const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/rbac.middleware');
const { Document, Record, User } = require('../models');
const { validateCSVContent } = require('../utils/csvValidator');

// Configurar multer para cargar archivos
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Subir CSV
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Leer contenido del archivo
    const fileContent = await fs.readFile(req.file.path, 'utf-8');

    // Validar contenido CSV
    const validation = validateCSVContent(fileContent);

    if (!validation.valid) {
      // Eliminar archivo subido si la validación falla
      await fs.unlink(req.file.path);
      return res.status(400).json({
        error: validation.message,
        details: validation.errors
      });
    }

    // Crear registro de documento
    const document = await Document.create({
      nombre: req.file.originalname,
      rutaArchivo: req.file.path,
      numeroRegistros: validation.count,
      userId: req.user.id
    });

    // Crear registros en la base de datos
    const recordsToCreate = validation.records.map(record => ({
      ...record,
      documentId: document.id
    }));

    await Record.bulkCreate(recordsToCreate);

    res.status(201).json({
      message: 'CSV uploaded and processed successfully',
      document: {
        id: document.id,
        nombre: document.nombre,
        numeroRegistros: document.numeroRegistros,
        fechaCarga: document.createdAt
      },
      recordsProcessed: validation.count
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Eliminar archivo subido en caso de error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    res.status(500).json({ error: 'Error processing CSV file' });
  }
});

// Obtener todos los documentos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const documents = await Document.findAll({
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      documents: documents.map(doc => ({
        id: doc.id,
        nombre: doc.nombre,
        numeroRegistros: doc.numeroRegistros,
        fechaCarga: doc.createdAt,
        usuario: doc.usuario
      }))
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Descargar documentos
router.get('/:id/download', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Verificar si el archivo existe
    try {
      await fs.access(document.rutaArchivo);
    } catch {
      return res.status(404).json({ error: 'File not found on server' });
    }

    res.download(document.rutaArchivo, document.nombre);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Error downloading file' });
  }
});

// Eliminar documento (solo admin)
router.delete('/:id', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Eliminar archivo del disco
    try {
      await fs.unlink(document.rutaArchivo);
    } catch (error) {
      console.warn('File already deleted or not found:', error.message);
    }

    // Eliminar documento (en cascada se eliminarán los registros relacionados)
    await document.destroy();

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Error deleting document' });
  }
});

module.exports = router;
