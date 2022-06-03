/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('tenable_sla_server', {
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
      total_vulns_critical: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      within_sla_vulns_critical: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      overdue_vulns_critical: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      total_vulns_high: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      within_sla_vulns_high: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      overdue_vulns_high: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      total_vulns_medium: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      within_sla_vulns_medium: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      overdue_vulns_medium: {
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
