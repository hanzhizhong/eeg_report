'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HospitalDoctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HospitalDoctor.init({
    doctorId: DataTypes.INTEGER,
    hospitalId:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HospitalDoctor',
  });
  return HospitalDoctor;
};