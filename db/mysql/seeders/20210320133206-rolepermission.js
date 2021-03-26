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
      {roleId:1,permissionId:2,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:3,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:4,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:5,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:6,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:7,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:8,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:9,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:10,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:11,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:12,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:13,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:14,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:15,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:16,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:17,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:18,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:19,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:20,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:21,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:22,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:23,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:24,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:25,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:26,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:27,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:28,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:29,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:30,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:31,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:32,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:33,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:34,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:36,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:37,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:38,createdAt:new Date(),updatedAt:new Date()},
      {roleId:1,permissionId:39,createdAt:new Date(),updatedAt:new Date()}
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
