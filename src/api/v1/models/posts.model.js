'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Comment}) {
      // define association here
      //userId
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });

		this.hasMany(Comment, { foreignKey: 'postId', as: 'comments' })

    }

    toJSON() {
      return { ...this.get()}// id: undefined};
    }
  }
  Post.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
		favorite: {
			type: DataTypes.BOOLEAN,
			defaultValue: false 
		}
    },
    {
      sequelize,
      modelName: 'Post',
      tableName: 'posts',
    }
  );
  return Post;
};
