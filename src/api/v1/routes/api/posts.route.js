const express = require('express');
const router = express.Router();
const PostsController = require('../../controllers/posts.controller');

router.get('/getAll', PostsController.getAllPosts);
router.get('/get/:uuid', PostsController.getEachPost);
router.get('/search', PostsController.searchPosts);
router.get('/get', PostsController.getPostsWithQuery);
//router.get('/favorite/:uuid', PostsController.changeFavByUuid)

router.post('/fetch', PostsController.fetchPosts);
router.post('/create', PostsController.createPost);

router.delete('/delete/:uuid', PostsController.deletePost);
router.patch('/edit', PostsController.editPost);

module.exports = router;
