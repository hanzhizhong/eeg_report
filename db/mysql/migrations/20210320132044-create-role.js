'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roleName: {
        type: Sequelize.STRING,
        unique:true 
      },
      roleEncode:{
        type:Sequelize.ENUM,
        values:["superadmin","admin","user","guest"],
        defaultValue:"user",
        allowNull:false
      },
      parentRoleId:{
        type:Sequelize.INTEGER
      },
      status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
      },
      createdId:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      level:{
        type:Sequelize.STRING,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Roles');
  }
};