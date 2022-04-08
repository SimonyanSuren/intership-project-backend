const CommentServices = require('../services/comments.service');
const { StatusCodes } = require('http-status-codes');

const fetchComments = async (req, res, next) => {
  CommentServices.fetch()
    .then((comments) => {
      res
        .status(StatusCodes.OK)
        .json({ msg: 'Comments created!', count: comments.length, comments });
    })
    .catch((err) => next(err));
};

const getAllCommentsOrByPost = async (req, res, next) => {
  CommentServices.findAll(req.query)
    .then((comments) => {
      res.status(StatusCodes.OK).json({ count: comments.length, comments });
    })
    .catch((err) => next(err));
};

const getEachComment = async (req, res, next) => {
  const uuid = req.params.uuid;
  CommentServices.findByUuid(uuid)
    .then((comment) => {
      res.status(StatusCodes.OK).json({ comment });
    })
    .catch((err) => next(err));
};

const createComment = async (req, res, next) => {
  const {postId, body, name } = req.body;
  CommentServices.create({ postId, body, name })
    .then((comment) => {
      res.status(StatusCodes.CREATED).json({ comment });
    })
    .catch((err) => next(err));
};

const deleteComment = async (req, res, next) => {
  const uuid = req.params.uuid;
  CommentServices.removeByUuid(uuid)
    .then((comment) => {
      res.status(StatusCodes.OK).json({ msg: 'Comments deleted!', comment });
    })
    .catch((err) => next(err));
};

const editComment = async (req, res, next) => {
  const commentData = req.body;
  CommentServices.updateById( commentData)
    .then((comment) => {
      res.status(StatusCodes.OK).json({ comment });
    })
    .catch((err) => next(err));
};

const searchComments = async (req, res, next) => {
  const { text } = req.query;
  CommentServices.search({ text })
    .then((result) => {
      res.status(StatusCodes.OK).json({ count: result.length, result });
    })
    .catch((err) => next(err));
};

module.exports = {
  fetchComments,
  getAllCommentsOrByPost,
  getEachComment,
  createComment,
  deleteComment,
  editComment,
  searchComments,
};
