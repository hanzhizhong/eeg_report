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
      Patient.belongsToMany(models.File,{through:"PatientFile"})
    }
  };
  Patient.init({
    patientName: DataTypes.STRING,
    gender:{
      type:DataTypes.ENUM,
      values:['男','女','其他'],
      defaultValue:'其他'
    },
    age:DataTypes.INTEGER,
    checkDate:{
      type:DataTypes.DATE,
      allowNull:null
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
    medicine:{
      type:DataTypes.STRING 
    },
    begDiag:{
      type:DataTypes.STRING 
    },
    graphicDiag:{
      type:DataTypes.STRING 
    },
    brainDiag:{
      type:DataTypes.STRING 
    },
    diagnosticianId:{
      type:DataTypes.INTEGER
    },
    applyDoctor:{
      type:DataTypes.INTEGER
    },
    operateDoctor:{
      type:DataTypes.INTEGER
    },
    hospitalId:{
      type:DataTypes.INTEGER
    },
    reportState:{
      type:DataTypes.ENUM,
      values:['0','1','2','3'],
        defaultValue:'3'
    },
    note:{
      type:DataTypes.STRING
    },
    history:{
      type:DataTypes.STRING
    },
    archives:{
      type:DataTypes.STRING
    },
    bingQu:{
      type:DataTypes.STRING
    },
    keShi:{
      type:DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};