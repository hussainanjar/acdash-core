/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
'use strict';

module.exports = {
  // @ts-ignore
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('abnormal_threats', 'recipient_name', {
      allowNull: true,
      type: Sequelize.STRING(255),
    });

    await queryInterface.addColumn('abnormal_threats', 'recipient_title', {
      allowNull: true,
      type: Sequelize.STRING(255),
    });
  },

  // @ts-ignore
  down: async (queryInterface, Sequelize) => {},
};
