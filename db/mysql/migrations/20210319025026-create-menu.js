'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Menus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      menuName: {
        type: Sequelize.STRING
      },
      menuUrl:{
        type:Sequelize.STRING
      },
      parentMenuId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultStatus:0
      },
      status:{
        type:Sequelize.BOOLEAN,
        defaultValue:true,
        allowNull:false 
      },
      icon:{
        type:Sequelize.STRING
      },
      level:{
        type:Sequelize.STRING,
        allowNull:false,
        defaultStatus:"0"
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
    await queryInterface.dropTable('Menus');
  }
};