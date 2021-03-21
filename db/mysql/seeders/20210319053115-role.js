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
      {roleName:"超级管理员",roleEncode:"SUPERMANAGER",status:true,createdAt:new Date(),updatedAt:new Date()},
      {roleName:"上级医院",roleEncode:"SENIORUSER",status:true,createdAt:new Date(),updatedAt:new Date()},
      {roleName:"下级医院",roleEncode:"NORMALUSER",status:true,createdAt:new Date(),updatedAt:new Date()}
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
