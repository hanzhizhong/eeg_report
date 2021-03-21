'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermissionFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PermissionFile.init({
    permissionId: {
      type: DataTypes.STRING
    },
    fileId:{
      type:DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'PermissionFile',
  });
  return PermissionFile;
};