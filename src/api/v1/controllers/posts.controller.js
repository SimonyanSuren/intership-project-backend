const PostServices = require('../services/posts.service');
const { StatusCodes } = require('http-status-codes');

const fetchPosts = async (req, res, next) => {
  PostServices.fetch()
    .then((posts) => {
      res
        .status(StatusCodes.OK)
        .json({ msg: 'Posts created!', count: posts.length, posts });
    })
    .catch((err) => next(err));
};

const getAllPosts = async (req, res, next) => {
  PostServices.findAll()
    .then((posts) => {
      res.status(StatusCodes.OK).json({ count: posts.length, posts });
    })
    .catch((err) => next(err));
};

const getPostsWithQuery = async (req, res, next) => {
  PostServices.findByQuery(req.query)
    .then((posts) => {
      res.status(StatusCodes.OK).json({ count: posts.length, posts });
    })
    .catch((err) => next(err));
};

const getEachPost = async (req, res, next) => {
  const uuid = req.params.uuid;
  PostServices.findByUuid(uuid)
    .then((post) => {
      res.status(StatusCodes.OK).json({ post });
    })
    .catch((err) => next(err));
};

const createPost = async (req, res, next) => {
  const { userId, body } = req.body;
  PostServices.create({ userId, body })
    .then((post) => {
      res.status(StatusCodes.CREATED).json({ post });
    })
    .catch((err) => next(err));
};

const deletePost = async (req, res, next) => {
  const uuid = req.params.uuid;
  PostServices.removeByUuid(uuid)
    .then((post) => {
      res.status(StatusCodes.OK).json({ msg: 'Post deleted!', post });
    })
    .catch((err) => next(err));
};

const editPost = async (req, res, next) => {
  const postData = req.body;
  PostServices.updateById(postData)
    .then((post) => {
      res.status(StatusCodes.OK).json({ post });
    })
    .catch((err) => next(err));
};

//const changeFavByUuid = async (req, res, next) => {
//  const { uuid } = req.body;
//  PostServices.changeFavByUuid(uuid)
//    .then((post) => {
//      res.status(StatusCodes.OK).json({ post });
//    })
//    .catch((err) => next(err));
//};

const searchPosts = async (req, res, next) => {
  const { text } = req.query;
  PostServices.search({ text })
    .then((result) => {
      res.status(StatusCodes.OK).json({ count: result.length, result });
    })
    .catch((err) => next(err));
};

module.exports = {
  fetchPosts,
  getPostsWithQuery,
  getEachPost,
  getAllPosts,
  createPost,
  deletePost,
  editPost,
  searchPosts,
};
