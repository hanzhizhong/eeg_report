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
      Hospital.belongsToMany(models.User,{through:"HospitalUser"})
      Hospital.belongsToMany(models.Group,{through:"HospitalGroup"})
      Hospital.belongsToMany(models.Meeting,{through:"HospitalMeeting"})
      Hospital.hasMany(models.Hospital,{foreignKey:"parentHospitalId"})
      Hospital.belongsToMany(models.Doctor,{through:"HospitalDoctor"})
    }
  };
  Hospital.init({
    hospitalName: {
      type:DataTypes.STRING,
      unique:"hospitalIndex" 
    },
    level:{
      type:DataTypes.ENUM,
      values:['省级','市级','地级'],
      defaultValue:"省级"
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