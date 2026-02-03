'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear el schema personalizado
    await queryInterface.createSchema('csv_app');
    
    // Crear tabla Users en el schema csv_app
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rol: {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user',
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      schema: 'csv_app'
    });

    // Crear índice único para email
    await queryInterface.addIndex(
      { tableName: 'Users', schema: 'csv_app' },
      ['email'],
      {
        unique: true,
        name: 'users_email_unique_idx'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // Eliminar tabla Users
    await queryInterface.dropTable({ tableName: 'Users', schema: 'csv_app' });
    
    // Eliminar el tipo ENUM
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "csv_app"."enum_Users_rol";');
    
    // Eliminar el schema (solo si está vacío)
    await queryInterface.dropSchema('csv_app');
  }
};
