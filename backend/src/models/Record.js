const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Document = require('./Document');

const Record = sequelize.define('Record', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true
    }
  },
  ciudad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  documentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Documents',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Associations
Record.belongsTo(Document, { foreignKey: 'documentId', onDelete: 'CASCADE' });
Document.hasMany(Record, { foreignKey: 'documentId' });

module.exports = Record;
