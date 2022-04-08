const { User } = require('../models');
const { Op, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const CustomError = require('../errors');

class UserServices extends User {
  constructor() {
    super();
  }

  async fetch() {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash('1234', salt);
    try {
      let { data } = await axios('https://jsonplaceholder.typicode.com/users');
      data = data.map((item) => {
        return (item = {
          name: item.name.split(' ')[0],
          lastname: item.name.split(' ')[1],
          nickname: item.username,
          email: item.email,
          password: hashPass,
        });
      });
      const users = await User.bulkCreate(data);
      return users;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const users = await User.findAll({ where: { role: 'user' } });
      if (users.length) {
        return users;
      }
      throw new CustomError.NotFoundError(`Users don't exist.`);
    } catch (error) {
      throw error;
    }
  }

  async findByUuid(uuid) {
    try {
      const user = await User.findOne({ where: { uuid }, include: 'posts' });
      if (!user) {
        throw new CustomError.NotFoundError(`No user with that id.`);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async removeByUuid(uuid) {
    try {
      const user = await User.findOne({ where: { uuid } });
      if (!user) {
        throw new CustomError.NotFoundError(`No user with that id.`);
      }
      await user.destroy();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateById(userData) {
    const { id, name, lastname, email, nickname } = userData;
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw new CustomError.NotFoundError(`No user with that id.`);
      }
      user.name = name;
      user.lastname = lastname;
      user.email = email;
      user.nickname = nickname;
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async search(userData) {
    const { name, lastname } = userData;
    try {
      const user = await User.findAll({
        where: {
          [Op.or]: [
            Sequelize.where(
              Sequelize.fn(
                'concat',
                Sequelize.col('name'),
                ' ',
                Sequelize.col('lastname')
              ),
              {
                [Op.iLike]: {
                  [Op.any]: [`%${name}%`, `%${lastname}%`],
                },
              }
            ),
          ],
        },
      });
      if (!user.length) {
        throw new CustomError.NotFoundError(`No user with that name.`);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserServices();
