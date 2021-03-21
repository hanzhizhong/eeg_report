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

    await queryInterface.bulkInsert('Elements',[
      {elemName:"首页广告",elemEncode:"shouyeguangao",status:true,createdAt:new Date(),updatedAt:new Date()},
      {elemName:"消息提示",elemEncode:"xiaoxitishi",status:true,createdAt:new Date(),updatedAt:new Date()},
      {elemName:"LOGO",elemEncode:"LOGO",status:true,createdAt:new Date(),updatedAt:new Date()}
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Elements',null,{})
  }
};
