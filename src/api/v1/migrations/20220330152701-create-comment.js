'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		 },
      body: {
        type: DataTypes.STRING(1000)
      },
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		 },
      postId: {
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comments');
  }
};