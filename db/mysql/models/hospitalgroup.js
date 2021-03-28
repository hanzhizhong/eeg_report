'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HospitalGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HospitalGroup.init({
    hospitalId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HospitalGroup',
  });
  return HospitalGroup;
};