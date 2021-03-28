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
    await queryInterface.bulkInsert('Roles',[
      {roleName:"超级管理员",roleEncode:"superadmin",parentRoleId:null,status:true,createdAt:new Date(),updatedAt:new Date()},
      {roleName:"管理员",roleEncode:"admin",parentRoleId:null,status:true,createdAt:new Date(),updatedAt:new Date()},
      {roleName:"普通用户",roleEncode:"user",parentRoleId:null,status:true,createdAt:new Date(),updatedAt:new Date()},
      {roleName:"访客",roleEncode:"guest",parentRoleId:null,status:true,createdAt:new Date(),updatedAt:new Date()}
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Roles',null,{})
  }
};
