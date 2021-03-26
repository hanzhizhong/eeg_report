'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userName: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      institutionId:{
        type:Sequelize.INTEGER,
      },
      loginName:{
        type:Sequelize.STRING
      },
      email:{
        type:Sequelize.STRING
      },
      phone:{
        type:Sequelize.STRING
      },
      gender:{
        type: Sequelize.ENUM,
        values: ['男', '女', '其他']
      },
      avatar:{
        type:Sequelize.STRING
      },
      password:{
        type:Sequelize.STRING,
        allowNull:false
      },
      status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
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
    await queryInterface.dropTable('Users');
  }
};