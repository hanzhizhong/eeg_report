'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Permissions',[
      {permissionType:"Admin",createdAt:new Date(),updatedAt:new Date()},
      {permissionType:"Senior",createdAt:new Date(),updatedAt:new Date()},
      {permissionType:"User",createdAt:new Date(),updatedAt:new Date()},
      {permissionType:"Guest",createdAt:new Date(),updatedAt:new Date()},
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Permissions',null,{})
  }
};
