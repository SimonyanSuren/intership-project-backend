const AuthServices = require('../services/auth.service');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const cookieParser = require('cookie-parser');

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  AuthServices.register({ name, email, password })
    .then(() => {
      res.status(StatusCodes.CREATED).json({
        msg: 'Success! Please check your email to verify account',
      });
    })
    .catch((err) => next(err));
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  AuthServices.login({ email, password })
    .then((result) => {
      const { user, token, oneDay } = result;

      res.clearCookie('token');
      res.cookie('token', token, {
        maxAge: oneDay,
        httpOnly: true,
        //  expire: Date.now() + oneDay,
        secure: process.env.JWT_SECRET,
        signed: true,
      });

      res.status(StatusCodes.OK).json({ user });
    })
    .catch((err) => next(err));
};

const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.status(StatusCodes.OK).json({ msg: 'User logged out!' });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  const { vToken, email } = req.query;

  AuthServices.verifyEmail({ vToken, email })
    .then(() => {
      res.status(StatusCodes.OK).json({ msg: 'Email Verified' });
    })
    .catch((err) => next(err));
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  AuthServices.forgotPassword(email)
    .then(() => {
      res
        .status(StatusCodes.OK)
        .json({ msg: 'Please check your email for reset password link' });
    })
    .catch((err) => next(err));
};

const resetPassword = async (req, res, next) => {
  const { token, email } = req.query;
  const { password } = req.body;
  AuthServices.resetPassword({ token, email, password })
    .then(() => {
      res.satatus(StatusCodes.OK).send('reset password');
    })
    .catch((err) => next(err));
};

const changePassword = async (req, res, next) => {
  const { email, password, newPassword } = req.body;
  const { token } = req.signedCookies;

  console.log(token);
  console.log(req.signedCookies, 'gggggg', req.cookies);
  AuthServices.changePassword({ email, password, newPassword, token })
    .then(() => {
      res.status(StatusCodes.OK).json({ msg: 'Password changed' });
    })
    .catch((err) => next(err));
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};
