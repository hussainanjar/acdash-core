/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('varonis_file_server_total_kpi', {
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
      file_server: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },
      no_of_folders: {
        allowNull: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      no_of_files: {
        allowNull: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      no_of_permission_entries: {
        allowNull: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      size_of_all_files_and_folders_gb: {
        allowNull: true,
        type: Sequelize.FLOAT(50),
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
