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
    await queryInterface.bulkInsert('PermissionMenus',[
      {permissionId:1,menuId:1,createdAt:new Date(),updatedAt:new Date()},
      {permissionId:1,menuId:2,createdAt:new Date(),updatedAt:new Date()},
      {permissionId:1,menuId:3,createdAt:new Date(),updatedAt:new Date()},
      {permissionId:1,menuId:4,createdAt:new Date(),updatedAt:new Date()},
      {permissionId:1,menuId:5,createdAt:new Date(),updatedAt:new Date()},
      {permissionId:1,menuId:6,createdAt:new Date(),updatedAt:new Date()}
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('PermissionMenus',null,{})
  }
};
