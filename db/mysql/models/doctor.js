'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Doctor.init({
    doctorName: {
      type:DataTypes.STRING,
      unique:"doctorIndex"
    },
    gender:{
      type:DataTypes.ENUM,
      values:['男','女','其他'],
      defaultValue:'男'
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true 
    },
    phone:{
      type:DataTypes.STRING,
      unique:"doctorIndex"
    }
  }, {
    sequelize,
    modelName: 'Doctor',
  });
  return Doctor;
};