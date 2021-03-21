'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermissionAction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PermissionAction.init({
    permissionId: {
      type: DataTypes.STRING
    },
    actionId:{
      type:DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'PermissionAction',
  });
  return PermissionAction;
};