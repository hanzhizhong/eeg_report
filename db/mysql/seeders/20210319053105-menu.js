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
    await queryInterface.bulkInsert('Menus',[
      {menuName:"报告管理",parentMenuId:null,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
      {menuName:"病例列表",parentMenuId:1,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
      {menuName:"远程会诊",parentMenuId:null,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
      {menuName:"会诊列表",parentMenuId:3,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
      {menuName:"基本信息",parentMenuId:null,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
      {menuName:"医院管理",parentMenuId:5,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
      {menuName:"系统设置",parentMenuId:null,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
      {menuName:"角色管理",parentMenuId:7,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
      {menuName:"权限管理",parentMenuId:7,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
      {menuName:"用户管理",parentMenuId:7,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
      {menuName:"用户组管理",parentMenuId:7,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
      {menuName:"菜单管理",parentMenuId:7,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
      {menuName:"文件管理",parentMenuId:7,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
      {menuName:"功能操作管理",parentMenuId:7,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
      {menuName:"页面元素管理",parentMenuId:7,status:true,icon:'',createdAt:new Date(),updatedAt:new Date()},
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Menus',null,{})
  }
};
