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
      Permission.belongsTo(models.Menu,{foreignKey:"typeId"});
      Permission.belongsTo(models.File,{foreignKey:"typeId"});
      Permission.belongsTo(models.Element,{foreignKey:"typeId"});
      Permission.belongsTo(models.Action,{foreignKey:"actionId"})

    }
  };
  Permission.init({
    typeName: DataTypes.STRING,
    typeId:DataTypes.INTEGER,
    actionId:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Permission',
  });
  return Permission;
};