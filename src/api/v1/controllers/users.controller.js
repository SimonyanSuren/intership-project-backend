const UserServices = require('../services/users.service');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const fetchUsers = async (req, res, next) => {
  UserServices.fetch()
    .then((users) => {
      res
        .status(201)
        .json({ msg: 'Users created!', count: users.length, users });
    })
    .catch((err) => next(err));
};

const getAllUsers = async (req, res, next) => {
	console.log(req.user);
  UserServices.findAll()
    .then((users) => {
      res.status(StatusCodes.OK).json({ count: users.length, users });
    })
    .catch((err) => next(err));
};

const getEachUser = async (req, res, next) => {
  const uuid = req.user.uuid;
  UserServices.findByUuid(uuid)
    .then((user) => {
      res.status(StatusCodes.OK).json({ user });
    })
    .catch((err) => next(err));
};

const deleteUser = async (req, res, next) => {
  const uuid = req.params.uuid;
  UserServices.removeByUuid(uuid)
    .then((user) => {
      res.status(StatusCodes.OK).json({ msg: 'User deleted!', user });
    })
    .catch((err) => next(err));
};

const editUser = async (req, res, next) => {
  const {id} = req.body;
  const { name, lastname, email, nickname } = req.body;
  UserServices.updateById( {id, name, lastname, email, nickname })
    .then((user) => {
      res.status(StatusCodes.OK).json({ user });
    })
    .catch((err) => next(err));
};

const searchUsers = async (req, res, next) => {
  const { name, lastname } = req.query;
  UserServices.search({ name, lastname })
    .then((result) => {
      res.status(StatusCodes.OK).json({ count: result.length, result });
    })
    .catch((err) => next(err));
};

module.exports = {
  getAllUsers,
  fetchUsers,
  getEachUser,
  deleteUser,
  editUser,
  searchUsers,
};
