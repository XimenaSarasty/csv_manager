const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rutaArchivo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numeroRegistros: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Relaciones
Document.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });
User.hasMany(Document, { foreignKey: 'userId' });

module.exports = Document;
