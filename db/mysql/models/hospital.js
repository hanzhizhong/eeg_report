'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hospital extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Hospital.init({
    hospitalName: {
      type:DataTypes.STRING,
      unique:"hospitalIndex" 
    },
    parentHospitalId:{
      type:DataTypes.INTEGER 
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull:false, 
      defaultValue:1
    },
    address:{
      type:DataTypes.STRING 
    },
    introduction:{
      type:DataTypes.STRING 
    },
    picture:{
      type:DataTypes.STRING 
    },
    hospitalEncode:{
      type:DataTypes.STRING,
      unique:"hospitalIndex"
    }
  }, {
    sequelize,
    modelName: 'Hospital',
  });
  return Hospital;
};