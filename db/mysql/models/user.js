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
      User.belongsTo(models.Group);
      User.belongsToMany(models.Role,{through:"UserRole"})
    }
  };
  User.init({
    userName: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    institutionId:{
      type:DataTypes.INTEGER,
    },
    loginName:{
      type:DataTypes.STRING
    },
    email:{
      type:DataTypes.STRING
    },
    phone:{
      type:DataTypes.INTEGER
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
    },
    roleId:{
      type:DataTypes.INTEGER,
      allowNull:false 
    },
    groupId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};