const router = require('express').Router();

const AuthController = require('../../controllers/auth.controller');
const {
  authenticateUser,
} = require('../../middleware/authentication.middleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/change-password', AuthController.changePassword);

router.delete('/logout', authenticateUser, AuthController.logout);

module.exports = router;
