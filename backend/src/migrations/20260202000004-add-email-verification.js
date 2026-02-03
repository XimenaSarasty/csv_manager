'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      { tableName: 'Users', schema: 'csv_app' },
      'emailVerified',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    );

    await queryInterface.addColumn(
      { tableName: 'Users', schema: 'csv_app' },
      'verificationToken',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      { tableName: 'Users', schema: 'csv_app' },
      'verificationTokenExpires',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      { tableName: 'Users', schema: 'csv_app' },
      'emailVerified'
    );
    
    await queryInterface.removeColumn(
      { tableName: 'Users', schema: 'csv_app' },
      'verificationToken'
    );
    
    await queryInterface.removeColumn(
      { tableName: 'Users', schema: 'csv_app' },
      'verificationTokenExpires'
    );
  }
};
