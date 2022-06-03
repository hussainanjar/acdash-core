/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('key_factor', {
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
      key_factor_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      thumb_print: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      serial_number: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      issued_dn: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      issued_cn: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      not_before: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      not_after: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      issuer_dn: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      principal_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      template_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cert_state: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      key_size_in_bits: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      key_type: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      requester_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      issued_ou: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      issued_email: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      key_usage: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      signing_algorithm: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      cert_state_string: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      key_type_string: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      revocation_eff_date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      revocation_reason: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      revocation_comment: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      certificate_authority_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      certificate_authority_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      template_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      archived_key: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      has_private_key: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      principal_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      cert_request_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      requester_name: {
        allowNull: true,
        type: Sequelize.STRING,
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
