'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('chat_messages', 'receiverId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Reference users table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('chat_messages', 'receiverId');
  }
};
