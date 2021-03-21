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
      {groupName:"上海诺诚",parentGroupId:null,status:true,userId:1,createdAt:new Date(),updatedAt:new Date()},
      {groupName:"上海闵行测试医院1",parentGroupId:null,status:true,userId:2,createdAt:new Date(),updatedAt:new Date()},
      {groupName:"上海闵行测试医院2",parentGroupId:null,status:true,userId:3,createdAt:new Date(),updatedAt:new Date()},
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
