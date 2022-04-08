const express = require('express');
const router = express.Router();
const CommentsController = require('../../controllers/comments.controller');

router.get('/getAll', CommentsController.getAllCommentsOrByPost);
router.get('/get/:uuid', CommentsController.getEachComment);
router.get('/search', CommentsController.searchComments);
//router.get('/getForPost/', CommentsController.getAllComments);
//router.get('/favorite/:uuid', CommentsController.changeFavByUuid)

router.post('/fetch', CommentsController.fetchComments);
router.post('/create', CommentsController.createComment);

router.delete('/delete/:uuid', CommentsController.deleteComment);
router.patch('/edit', CommentsController.editComment);

module.exports = router;
