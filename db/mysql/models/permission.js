'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Permission.belongsToMany(models.Role,{through:"RolePermission"});
      Permission.belongsToMany(models.Action,{through:"PermissionAction"});
      Permission.belongsToMany(models.Menu,{through:"PermissionMenu"});
      Permission.belongsToMany(models.File,{through:"PermissionFile"});
      Permission.belongsToMany(models.Element,{through:"PermissionElement"});

    }
  };
  Permission.init({
    permissionType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Permission',
  });
  return Permission;
};