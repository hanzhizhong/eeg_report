'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermissionElement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PermissionElement.init({
    permissionId: {
      type: DataTypes.INTEGER 
    },
    elementId:{
      type:DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'PermissionElement',
  });
  return PermissionElement;
};