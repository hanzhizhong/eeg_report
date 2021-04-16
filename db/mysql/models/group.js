'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsToMany(models.Role,{through:"GroupRole"})
      Group.belongsToMany(models.User,{through:"UserGroup"})
      Group.belongsToMany(models.Hospital,{through:"HospitalGroup"})
      Group.hasMany(models.Group,{foreignKey:"parentGroupId"})
    }
  };
  Group.init({
    groupName: {
      type: DataTypes.STRING
    },
    parentGroupId:{
      type:DataTypes.INTEGER
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};