const router = require('express').Router();

const usersRouter = require('./api/users.route');
const postsRouter = require('./api/posts.route');
const commentsRouter = require('./api/comments.route');
const authRouter = require('./api/auth.route');

const { authenticateUser } = require('../middleware/authentication.middleware');

router.use('/user',authenticateUser, usersRouter);
router.use('/posts', postsRouter);
router.use('/comments', authenticateUser, commentsRouter);
router.use('/auth', authRouter);

module.exports = router;
