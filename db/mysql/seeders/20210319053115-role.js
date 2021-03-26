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
      {roleName:"超级管理员",roleEncode:"superadmin",status:true,createdAt:new Date(),updatedAt:new Date()},
      {roleName:"管理员",roleEncode:"admin",status:true,createdAt:new Date(),updatedAt:new Date()},
      {roleName:"普通用户",roleEncode:"user",status:true,createdAt:new Date(),updatedAt:new Date()},
      {roleName:"访客",roleEncode:"guest",status:true,createdAt:new Date(),updatedAt:new Date()}
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
