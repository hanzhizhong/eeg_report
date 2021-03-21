'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Action extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Action.belongsToMany(models.Permission,{through:"PermissionAction"});
    }
  };
  Action.init({
    actionName: DataTypes.STRING,
    actionEncode:{
      type:DataTypes.STRING
    },
    status:{
      type:DataTypes.BOOLEAN,
      defaultValue:true,
      allowNull:false 
    },
  }, {
    sequelize,
    modelName: 'Action',
  });
  return Action;
};