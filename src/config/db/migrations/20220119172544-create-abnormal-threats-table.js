/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('abnormal_threats', {
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
        type: Sequelize.STRING(40),
      },
      abx_message_id: {
        allowNull: true,
        type: Sequelize.STRING(40),
      },
      abx_portal_url: {
        allowNull: true,
        type: Sequelize.STRING(150),
      },
      subject: {
        allowNull: true,
        type: Sequelize.STRING(256),
      },
      from_address: {
        allowNull: true,
        type: Sequelize.STRING(256),
      },
      from_name: {
        allowNull: true,
        type: Sequelize.STRING(256),
      },
      to_addresses: {
        allowNull: true,
        type: Sequelize.STRING(256),
      },
      recipient_address: {
        allowNull: true,
        type: Sequelize.STRING(256),
      },
      received_time: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      sent_time: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      internet_message_id: {
        allowNull: true,
        type: Sequelize.STRING(256),
      },
      auto_remediated: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      post_remediated: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      attack_type: {
        allowNull: true,
        type: Sequelize.STRING(70),
      },
      attack_strategy: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      return_path: {
        allowNull: true,
        type: Sequelize.STRING(256),
      },
      reply_to_emails: {
        allowNull: true,
        type: Sequelize.STRING(1000),
      },
      impersonated_party: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      attack_vector: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      summary_insights: {
        allowNull: true,
        type: Sequelize.STRING(1000),
      },
      remediation_timestamp: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      is_read: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      attacked_party: {
        allowNull: true,
        type: Sequelize.STRING(50),
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
