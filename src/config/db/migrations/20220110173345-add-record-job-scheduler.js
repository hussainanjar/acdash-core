/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "INSERT INTO job_scheduler ([name], [run_pattern], [is_processing], [is_active], [created_at], [updated_at]) VALUES ('OKTA_AUTH_JOB_SCHEDULER', '*/60 * * * * *', 0, 1, '2021-11-19 21:03:57', '2021-11-19 21:03:58');",
    );
  },

  down: async (queryInterface, Sequelize) => {},
};
