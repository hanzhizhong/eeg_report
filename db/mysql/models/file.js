'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      File.belongsToMany(models.Patient,{through:"PatientFile"});
      File.belongsTo(models.Hospital,{foreignKey:"hospitalId"});
      File.belongsTo(models.User,{foreignKey:"uploadUserId"})
    }
  };
  File.init({
    fileName: {
      type: DataTypes.STRING,
      unique:true
    },
    fileUrl:{
      type:DataTypes.STRING
    },
    parentFileId:{
      type:DataTypes.INTEGER
    },
    fileSize:{
      type:DataTypes.INTEGER
    },
    hospitalId:{
      type:DataTypes.INTEGER
    },
    uploadUserId:{
      type:DataTypes.INTEGER
    },
    status:{
      type:DataTypes.BOOLEAN,
      defaultValue:true,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'File',
  });
  return File;
};