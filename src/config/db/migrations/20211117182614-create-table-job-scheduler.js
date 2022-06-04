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

    await queryInterface.bulkInsert(
      'job_scheduler',
      [
        {
          name: 'JOB_SCHEDULER',
          run_pattern: '*/60 * * * * *',
          is_processing: false,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {},
};
