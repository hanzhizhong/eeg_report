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
    await queryInterface.bulkInsert('UserRoles',[
      {userId:1,roleId:1,createdAt:new Date(),updatedAt:new Date()},
      {userId:2,roleId:2,createdAt:new Date(),updatedAt:new Date()},
      {userId:3,roleId:3,createdAt:new Date(),updatedAt:new Date()},
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('UserRoles',null,{})
  }
};
