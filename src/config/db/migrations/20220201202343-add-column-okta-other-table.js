/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

module.exports = {
  // @ts-ignore
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('okta_other_detail', 'locked_record_total', {
      allowNull: true,
      type: Sequelize.INTEGER,
    });
  },

  // @ts-ignore
  down: async (queryInterface, Sequelize) => {},
};
