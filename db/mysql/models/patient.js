'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Patient.init({
    patientName: DataTypes.STRING,
    phone:{
      type:DataTypes.STRING
    },
    gender:{
      type:DataTypes.ENUM,
      values:['男','女','其他'],
      defaultValue:'其他'
    },
    age:DataTypes.INTEGER,
    checkDate:{
      type:DataTypes.DATE,
      defaultValue:DataTypes.NOW
    },
    status:{
      type:DataTypes.BOOLEAN,
      defaultValue:1,
      allowNull:false
    },
    eegNo:{
      type:DataTypes.STRING 
    },
    bedNo:{
      type:DataTypes.STRING 
    },
    pharmacy:{
      type:DataTypes.STRING 
    },
    eegMonitorDiagnosis:{
      type:DataTypes.STRING 
    },
    eegMapDiagnosis:{
      type:DataTypes.STRING 
    },
    diagnosticianId:{
      type:DataTypes.INTEGER
    },
    applyDoctorId:{
      type:DataTypes.INTEGER
    },
    operateDoctorId:{
      type:DataTypes.INTEGER
    },
    reportStatus:{
      type:DataTypes.ENUM,
      values:['0','1','2','3'],
        defaultValue:'3'
    },
    note:{
      type:DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};