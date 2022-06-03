/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('varonis_user_account_disable_kpi', {
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
      operation_source: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      event_time: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      file_server_domain: {
        allowNull: true,
        type: Sequelize.STRING(150),
      },
      object_type: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      path: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },
      object: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      event_operation: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },

      event_type: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      event_status: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      operation_by: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      event_description: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      file_type: {
        allowNull: true,
        type: Sequelize.STRING(20),
      },
      event_count: {
        allowNull: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      device_ip_address: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      device_name: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      mail_source: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      mail_recipients: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      mail_date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      attachment_name: {
        allowNull: true,
        type: Sequelize.STRING(100),
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
