/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('job_scheduler', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      run_pattern: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      is_processing: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

    await queryInterface.sequelize.query(
      "INSERT INTO job_scheduler ([name], [run_pattern], [is_processing], [is_active], [created_at], [updated_at]) VALUES ('JOB_SCHEDULER', '*/60 * * * * *', 0, 1, '2021-11-19 21:03:57', '2021-11-19 21:03:58');",
    );
  },

  down: async (queryInterface, Sequelize) => {},
};
