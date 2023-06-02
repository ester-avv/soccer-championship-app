'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING(300),
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING(300),
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(300),
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(300),
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};