/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('tenable_vpr_mitigate_vulns', {
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
      current_month_vpr_low: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      current_month_vpr_medium: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      current_month_vpr_high: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      current_month_vpr_critical: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      last_month_vpr_low: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      last_month_vpr_medium: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      last_month_vpr_high: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      last_month_vpr_critical: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      current_quarter_vpr_low: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      current_quarter_vpr_medium: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      current_quarter_vpr_high: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      current_quarter_vpr_critical: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      last_quarter_vpr_low: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      last_quarter_vpr_medium: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      last_quarter_vpr_high: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      last_quarter_vpr_critical: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      over_days_vpr_low: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      over_days_vpr_medium: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      over_days_vpr_high: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      over_days_vpr_critical: {
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
