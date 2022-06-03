/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('alert_logic', {
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

      account_id: {
        allowNull: true,
        type: Sequelize.INTEGER(200),
      },
      asset_deployment_type: {
        allowNull: true,
        type: Sequelize.STRING(200),
      },
      asset_host_name: {
        allowNull: true,
        type: Sequelize.STRING(200),
      },
      associated_event_count: {
        allowNull: true,
        type: Sequelize.INTEGER(200),
      },
      associated_log_count: {
        allowNull: true,
        type: Sequelize.INTEGER(200),
      },
      auto_closed: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      auto_closed_by: {
        allowNull: true,
        type: Sequelize.INTEGER(200),
      },
      auto_closed_user_name: {
        allowNull: true,
        type: Sequelize.STRING(200),
      },
      create_time: {
        allowNull: true,
        type: Sequelize.FLOAT(50),
      },
      create_time_str: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      customer_feedback_note_count: {
        allowNull: true,
        type: Sequelize.INTEGER(200),
      },
      customer_status_reason_code: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      customer_status: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      customer_status_change_time: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      customer_status_user_id: {
        allowNull: true,
        type: Sequelize.STRING(200),
      },
      customer_status_user_name: {
        allowNull: true,
        type: Sequelize.STRING(200),
      },
      has_assets: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      human_friendly_id: {
        allowNull: true,
        type: Sequelize.STRING(200),
      },
      incident_id: {
        allowNull: true,
        type: Sequelize.STRING(200),
      },
      incident_threat_rating: {
        allowNull: true,
        type: Sequelize.STRING(200),
      },
      incident_atttack_class_id: {
        allowNull: true,
        type: Sequelize.INTEGER(200),
      },
      incident_atttack_class_id_str: {
        allowNull: true,
        type: Sequelize.STRING(200),
      },
      incident_escalated: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      incident_escalation_time: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      note_count: {
        allowNull: true,
        type: Sequelize.INTEGER(200),
      },
      snooze_status_snoozed: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      update_time: {
        allowNull: true,
        type: Sequelize.INTEGER(200),
      },
      update_time_str: {
        allowNull: true,
        type: Sequelize.DATE,
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
