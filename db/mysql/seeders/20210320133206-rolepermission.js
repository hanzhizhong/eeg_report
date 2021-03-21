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
    await queryInterface.bulkInsert('RolePermissions',[
      {roleId:1,permissionId:1,createdAt:new Date(),updatedAt:new Date()},
      {roleId:2,permissionId:2,createdAt:new Date(),updatedAt:new Date()},
      {roleId:3,permissionId:2,createdAt:new Date(),updatedAt:new Date()}
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('RolePermissions',null,{})
  }
};
