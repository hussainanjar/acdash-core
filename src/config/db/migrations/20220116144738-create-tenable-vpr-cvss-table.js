/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('tenable_vpr_cvss', {
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
      cvss_low_vpr_low: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_low_vpr_medium: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_low_vpr_high: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_low_vpr_critical: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_medium_vpr_low: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_medium_vpr_medium: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_medium_vpr_high: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_medium_vpr_critical: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_high_vpr_low: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_high_vpr_medium: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_high_vpr_high: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_high_vpr_critical: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_critical_vpr_low: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_critical_vpr_medium: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_critical_vpr_high: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cvss_critical_vpr_critical: {
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
