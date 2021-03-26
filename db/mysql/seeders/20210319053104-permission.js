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
    await queryInterface.bulkInsert('Permissions',[
      {actionId:null,typeName:"MENU",typeId:7,createdAt:new Date(),updatedAt:new Date()},
      {actionId:1,typeName:"MENU",typeId:8,createdAt:new Date(),updatedAt:new Date()},
      {actionId:2,typeName:"MENU",typeId:8,createdAt:new Date(),updatedAt:new Date()},
      {actionId:3,typeName:"MENU",typeId:8,createdAt:new Date(),updatedAt:new Date()},
      {actionId:4,typeName:"MENU",typeId:8,createdAt:new Date(),updatedAt:new Date()},
      {actionId:1,typeName:"MENU",typeId:9,createdAt:new Date(),updatedAt:new Date()},
      {actionId:2,typeName:"MENU",typeId:9,createdAt:new Date(),updatedAt:new Date()},
      {actionId:3,typeName:"MENU",typeId:9,createdAt:new Date(),updatedAt:new Date()},
      {actionId:4,typeName:"MENU",typeId:9,createdAt:new Date(),updatedAt:new Date()},
      {actionId:1,typeName:"MENU",typeId:10,createdAt:new Date(),updatedAt:new Date()},
      {actionId:2,typeName:"MENU",typeId:10,createdAt:new Date(),updatedAt:new Date()},
      {actionId:3,typeName:"MENU",typeId:10,createdAt:new Date(),updatedAt:new Date()},
      {actionId:4,typeName:"MENU",typeId:10,createdAt:new Date(),updatedAt:new Date()},
      {actionId:1,typeName:"MENU",typeId:11,createdAt:new Date(),updatedAt:new Date()},
      {actionId:2,typeName:"MENU",typeId:11,createdAt:new Date(),updatedAt:new Date()},
      {actionId:3,typeName:"MENU",typeId:11,createdAt:new Date(),updatedAt:new Date()},
      {actionId:4,typeName:"MENU",typeId:11,createdAt:new Date(),updatedAt:new Date()},
      {actionId:1,typeName:"MENU",typeId:12,createdAt:new Date(),updatedAt:new Date()},
      {actionId:2,typeName:"MENU",typeId:12,createdAt:new Date(),updatedAt:new Date()},
      {actionId:3,typeName:"MENU",typeId:12,createdAt:new Date(),updatedAt:new Date()},
      {actionId:4,typeName:"MENU",typeId:12,createdAt:new Date(),updatedAt:new Date()},
      {actionId:1,typeName:"MENU",typeId:13,createdAt:new Date(),updatedAt:new Date()},
      {actionId:2,typeName:"MENU",typeId:13,createdAt:new Date(),updatedAt:new Date()},
      {actionId:3,typeName:"MENU",typeId:13,createdAt:new Date(),updatedAt:new Date()},
      {actionId:4,typeName:"MENU",typeId:13,createdAt:new Date(),updatedAt:new Date()},
      {actionId:1,typeName:"MENU",typeId:14,createdAt:new Date(),updatedAt:new Date()},
      {actionId:2,typeName:"MENU",typeId:14,createdAt:new Date(),updatedAt:new Date()},
      {actionId:3,typeName:"MENU",typeId:14,createdAt:new Date(),updatedAt:new Date()},
      {actionId:4,typeName:"MENU",typeId:14,createdAt:new Date(),updatedAt:new Date()},
      {actionId:1,typeName:"MENU",typeId:15,createdAt:new Date(),updatedAt:new Date()},
      {actionId:2,typeName:"MENU",typeId:15,createdAt:new Date(),updatedAt:new Date()},
      {actionId:3,typeName:"MENU",typeId:15,createdAt:new Date(),updatedAt:new Date()},
      {actionId:4,typeName:"MENU",typeId:15,createdAt:new Date(),updatedAt:new Date()},
      {actionId:null,typeName:"ELEMENT",typeId:1,createdAt:new Date(),updatedAt:new Date()},
      {actionId:null,typeName:"FILE",typeId:1,createdAt:new Date(),updatedAt:new Date()},
      {actionId:1,typeName:"ELEMENT",typeId:2,createdAt:new Date(),updatedAt:new Date()},
      {actionId:1,typeName:"ELEMENT",typeId:3,createdAt:new Date(),updatedAt:new Date()},
      {actionId:null,typeName:"FILE",typeId:2,createdAt:new Date(),updatedAt:new Date()},
      {actionId:null,typeName:"FILE",typeId:3,createdAt:new Date(),updatedAt:new Date()}
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Permissions',null,{})
  }
};
