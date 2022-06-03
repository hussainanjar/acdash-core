/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-ts-comment */
'use strict';

module.exports = {
  // @ts-ignore
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'application_storage',
      [
        {
          key_name: 'SWITCH_WEEKLY_TO_MONTHLY_TIME_SLOT',
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
