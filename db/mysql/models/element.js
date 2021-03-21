'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Element extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Element.belongsToMany(models.Permission,{through:"PermissionElement"});
    }
  };
  Element.init({
    elemName: {
      type: DataTypes.STRING
    },
    elemEncode:{
      type:DataTypes.STRING
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true 
    },
  }, {
    sequelize,
    modelName: 'Element',
  });
  return Element;
};