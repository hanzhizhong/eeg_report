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
    await queryInterface.bulkInsert('Users',[
      {userName:"王祥",loginName:"wangxiang",email:"12345@qq.com",phone:"13668789945",gender:'男',avatar:'',password:"123456",status:true,createdAt:new Date(),updatedAt:new Date()},
      {userName:"韩忠",loginName:"hanzhong",email:"12345@qq.com",phone:"13668789945",gender:'男',avatar:'',password:"123456",status:true,createdAt:new Date(),updatedAt:new Date()},
      {userName:"傅敏华",loginName:"david",email:"12345@qq.com",phone:"13668789945",gender:'男',avatar:'',password:"123456",status:true,createdAt:new Date(),updatedAt:new Date()},
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users',null,{})
  }
};
