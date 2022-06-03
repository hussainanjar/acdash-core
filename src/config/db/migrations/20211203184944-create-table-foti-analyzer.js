/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('foti_analyzer', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      processing_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      threat_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      threat: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      category: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      threat_level: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      threat_score: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      incidents: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
