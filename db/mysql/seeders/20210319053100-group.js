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
    await queryInterface.bulkInsert('Groups',[
      {groupName:"上海诺诚组",parentGroupId:null,createBy:"",status:true,createdAt:new Date(),updatedAt:new Date()},
      {groupName:"上海闵行测试医院1组",parentGroupId:null,createBy:"",status:true,createdAt:new Date(),updatedAt:new Date()},
      {groupName:"上海闵行测试医院2组",parentGroupId:null,createBy:"",status:true,createdAt:new Date(),updatedAt:new Date()},
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Groups',null,{})
  }
};
