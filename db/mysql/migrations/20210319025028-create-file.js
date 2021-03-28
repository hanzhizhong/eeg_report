'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fileName: {
        type: Sequelize.STRING,
        unique:true
      },
      fileUrl:{
        type:Sequelize.STRING
      },
      parentFileId:{
        type:Sequelize.INTEGER
      },
      fileSize:{
        type:Sequelize.INTEGER
      },
      uploadUserId:{
        type:Sequelize.INTEGER
      },
      status:{
        type:Sequelize.BOOLEAN,
        defaultValue:true,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Files');
  }
};