'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Doctors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorName: {
        type:Sequelize.STRING,
        unique:"doctorIndex"
      },
      gender:{
        type:Sequelize.ENUM,
        values:['男','女','其他'],
        defaultValue:'男'
      },
      status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true 
      },
      phone:{
        type:Sequelize.STRING,
        unique:"doctorIndex"
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
    await queryInterface.dropTable('Doctors');
  }
};