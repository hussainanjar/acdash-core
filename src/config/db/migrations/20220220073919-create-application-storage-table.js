/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-ts-comment */
'use strict';

module.exports = {
  // @ts-ignore
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('application_storage', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      key_name: {
        allowNull: true,
        type: Sequelize.STRING(255),
        unique: true,
      },
      value: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },
      is_active: {
        allowNull: true,
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
      'application_storage',
      [
        {
          key_name: 'SWITCH_WEEKLY_TO_DAILY_TIME_SLOT',
          value: '1',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  // @ts-ignore
  down: async (queryInterface, Sequelize) => {},
};
