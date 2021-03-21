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
    await queryInterface.bulkInsert('Actions',[
      {actionName:"增加",actionEncode:"CREATE",status:true,createdAt:new Date(),updatedAt:new Date()},
      {actionName:"编辑",actionEncode:"UPDATE",status:true,createdAt:new Date(),updatedAt:new Date()},
      {actionName:"删除",actionEncode:"DELETE",status:true,createdAt:new Date(),updatedAt:new Date()},
      {actionName:"查看",actionEncode:"READ",status:true,createdAt:new Date(),updatedAt:new Date()},
      {actionName:"处理",actionEncode:"HANDAL",status:true,createdAt:new Date(),updatedAt:new Date()},
      {actionName:"上传",actionEncode:"UPLOAD",status:true,createdAt:new Date(),updatedAt:new Date()},
      {actionName:"提交",actionEncode:"SUBMIT",status:true,createdAt:new Date(),updatedAt:new Date()},
      {actionName:"保存",actionEncode:"SAVE",status:true,createdAt:new Date(),updatedAt:new Date()},
      {actionName:"下载",actionEncode:"DOWNLOAD",status:true,createdAt:new Date(),updatedAt:new Date()},
      {actionName:"发布",actionEncode:"PUBLISH",status:true,createdAt:new Date(),updatedAt:new Date()},
      {actionName:"创建会诊",actionEncode:"CREATEVIDEOROOM",status:true,createdAt:new Date(),updatedAt:new Date()},
      {actionName:"加入会诊",actionEncode:"JOINVIDEOROOM",status:true,createdAt:new Date(),updatedAt:new Date()},
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Actions',null,{})
  }
};
