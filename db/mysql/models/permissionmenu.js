'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermissionMenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PermissionMenu.init({
    permissionId: {
      type: DataTypes.STRING
    },
    menuId:{
      type:DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'PermissionMenu',
  });
  return PermissionMenu;
};