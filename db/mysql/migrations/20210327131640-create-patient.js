'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Patients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patientName: {
        type: Sequelize.STRING
      },
      phone:{
        type:Sequelize.STRING
      },
      gender:{
        type:Sequelize.ENUM,
        values:['男','女','其他'],
        defaultValue:'其他'
      },
      age:Sequelize.INTEGER,
      checkDate:{
        type:Sequelize.DATE,
        defaultValue:Sequelize.NOW
      },
      status:{
        type:Sequelize.BOOLEAN,
        defaultValue:1,
        allowNull:false
      },
      eegNo:{
        type:Sequelize.STRING 
      },
      bedNo:{
        type:Sequelize.STRING 
      },
      pharmacy:{
        type:Sequelize.STRING 
      },
      eegMonitorDiagnosis:{
        type:Sequelize.STRING 
      },
      eegMapDiagnosis:{
        type:Sequelize.STRING 
      },
      diagnosticianId:{
        type:Sequelize.INTEGER
      },
      applyDoctorId:{
        type:Sequelize.INTEGER
      },
      operateDoctorId:{
        type:Sequelize.INTEGER
      },
      reportStatus:{
        type:Sequelize.ENUM,
        values:[0,1,2,3],
        defaultValue:3
      },
      note:{
        type:Sequelize.STRING
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
    await queryInterface.dropTable('Patients');
  }
};