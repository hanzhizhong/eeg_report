'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.belongsToMany(models.User,{through:"UserRole"});
      Role.belongsToMany(models.Permission,{through:"RolePermission"});
      Role.belongsToMany(models.Group,{through:"GroupRole"})
    }
  };
  Role.init({
    roleName: {
      type: DataTypes.STRING,
      unique:true 
    },
    roleEncode:{
      type:DataTypes.ENUM,
      values:["superadmin","admin","user","guest"],
      defaultValue:"user",
      allowNull:false
    },
    parentRoleId:{
      type:DataTypes.INTEGER
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true
    },
    createdId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    level:{
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};