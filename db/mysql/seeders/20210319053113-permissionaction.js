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
    await queryInterface.bulkInsert('PermissionActions',[
      {permissionId:1,actionId:1,createdAt:new Date(),updatedAt:new Date()},
      {permissionId:1,actionId:2,createdAt:new Date(),updatedAt:new Date()},
      {permissionId:1,actionId:3,createdAt:new Date(),updatedAt:new Date()},
      {permissionId:1,actionId:4,createdAt:new Date(),updatedAt:new Date()},
      {permissionId:1,actionId:5,createdAt:new Date(),updatedAt:new Date()},
      {permissionId:1,actionId:6,createdAt:new Date(),updatedAt:new Date()},
      {permissionId:1,actionId:7,createdAt:new Date(),updatedAt:new Date()},
      {permissionId:1,actionId:8,createdAt:new Date(),updatedAt:new Date()},
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('PermissionActions',null,{})
  }
};
