/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('varonis_user_expired_password_kpi', {
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
      type: {
        allowNull: true,
        type: Sequelize.STRING(30),
      },
      domain_name: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      ou_name: {
        allowNull: true,
        type: Sequelize.STRING(150),
      },
      user_group: {
        allowNull: true,
        type: Sequelize.STRING(150),
      },
      logon_name: {
        allowNull: true,
        type: Sequelize.STRING(150),
      },
      pwd_last_set: {
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
