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
      File.belongsTo(models.Patient,{foreignKey:"patientId"})
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
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:0
    },
    level:{
      type:DataTypes.STRING,
      allowNull:false
    },
    typeName:{
      type:DataTypes.ENUM,
      values:['FOLDER','FILE'],
      defaultValue:"FILE"
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
    patientId:{
      type:DataTypes.INTEGER,
      allowNull:false
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