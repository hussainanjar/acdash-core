/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'job_scheduler',
      [
        {
          name: 'OKTA_AUTH_JOB_SCHEDULER',
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
