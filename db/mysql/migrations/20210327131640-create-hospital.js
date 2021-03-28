'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Hospitals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hospitalName: {
        type:Sequelize.STRING,
        unique:"hospitalIndex" 
      },
      parentHospitalId:{
        type:Sequelize.INTEGER 
      },
      status:{
        type:Sequelize.BOOLEAN,
        allowNull:false, 
        defaultValue:1
      },
      address:{
        type:Sequelize.STRING 
      },
      introduction:{
        type:Sequelize.STRING 
      },
      picture:{
        type:Sequelize.STRING 
      },
      hospitalEncode:{
        type:Sequelize.STRING,
        unique:"hospitalIndex"
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
    await queryInterface.dropTable('Hospitals');
  }
};