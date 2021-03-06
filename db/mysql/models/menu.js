'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //Menu.belongsTo(models.Permission,{foreignKey:"id"});
      Menu.hasMany(models.Menu,{foreignKey:"parentMenuId"})
    }
  };
  Menu.init({
    menuName: {
      type: DataTypes.STRING
    },
    parentMenuId:{
      type:DataTypes.INTEGER
    },
    menuUrl:{
      type:DataTypes.STRING 
    },
    status:{
      type:DataTypes.BOOLEAN,
      defaultValue:true,
      allowNull:false 
    },
    icon:{
      type:DataTypes.STRING
    },
    level:{
      type:DataTypes.STRING,
      defaultValue:"0",
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Menu',
  });
  return Menu;
};