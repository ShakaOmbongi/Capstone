'use strict';
//query for tables
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
    
    return queryInterface.bulkInsert('roles', [
      {
        name: 'STUDENT',
        description: 'Student role',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'TUTOR',
        description: 'Tutor role',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'ADMIN',
        description: 'Administrator role',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', {
      name: { [Sequelize.Op.in]: ['STUDENT', 'TUTOR', 'ADMIN'] }
    }, {});
  }
};
