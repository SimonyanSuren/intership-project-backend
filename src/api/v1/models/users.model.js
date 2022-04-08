'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post, Comment }) {
      // define association here
      this.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
      this.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
    }

    toJSON() {
      return {
        ...this.get(),
      //  id: undefined,
        password: undefined,
        verificationToken: undefined,
        isVerified: undefined,
        verified: undefined,
        passwordToken: undefined,
        passwordTokenExpirationDate: undefined,
      };
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Name must not be empty' },
          is: {
            args: [/^[A-Za-z0-9]*$/g],
            msg: 'Name must contains only letters and numbers',
          },
          len: {
            args: [3, 30],
            msg: 'Name must be longer!',
          },
        },
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [3, 30],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Email must not be empty' },
          isEmail: { msg: 'Must be a valid email address' },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Password must not be empty' },
          min: 8,
        },
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [3, 30],
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
        validate: {
          isIn: [['admin', 'user']],
        },
      },
      verificationToken: {
        type: DataTypes.STRING,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
      verified: {
        type: DataTypes.DATE,
      },
      passwordToken: {
        type: DataTypes.STRING,
      },
      passwordTokenExpirationDate: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
    }
  );
  return User;
};
