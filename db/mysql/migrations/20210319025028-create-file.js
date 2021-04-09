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
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      fileSize:{
        type:Sequelize.INTEGER
      },
      hospitalId:{
        type:Sequelize.INTEGER
      },
      level:{
        type:Sequelize.STRING,
        defaultValue:"0",
        allowNull:false
      },
      typeName:{
        type:Sequelize.ENUM,
        values:['FOLDER','FILE'],
        defaultValue:"FILE"
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