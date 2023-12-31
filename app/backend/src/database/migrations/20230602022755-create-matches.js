'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("matches", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      homeTeamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "home_team_id",
        onUpdate: "CASCADE",
        onDetele: "CASCADE",
        references: {
          model: "teams",
          key: 'id',
        }
      },
      homeTeamGoals: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "home_team_goals",
      },
      awayTeamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "away_team_id",
        onUpdate: "CASCADE",
        onDetele: "CASCADE",
        references: {
          model: "teams",
          key: 'id',
        }
      },
      awayTeamGoals: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "away_team_goals",
      },
      inProgress: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "in_progress",
      }
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable("matches");
  },
};