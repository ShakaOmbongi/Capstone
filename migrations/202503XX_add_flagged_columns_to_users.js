'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'flagReason', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Reason why the user is flagged (if applicable)',
    });
    await queryInterface.addColumn('users', 'suspended', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indicates if the user is suspended',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'flagReason');
    await queryInterface.removeColumn('users', 'suspended');
  }
};
