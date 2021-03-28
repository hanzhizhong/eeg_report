'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Group,{through:"UserGroup"});
      User.belongsToMany(models.Role,{through:"UserRole"})
    }
  };
  User.init({
    userName: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:"userIndex"
    },
    loginName:{
      type:DataTypes.STRING,
      unique:true
    },
    email:{
      type:DataTypes.STRING,
      unique:"userIndex"
    },
    phone:{
      type:DataTypes.INTEGER,
      unique:"userIndex"
    },
    gender:{
      type: DataTypes.ENUM,
      values: ['男', '女', '其他']
    },
    avatar:{
      type:DataTypes.STRING
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};