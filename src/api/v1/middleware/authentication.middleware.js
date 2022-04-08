const jwt = require('jsonwebtoken')
const CustomError = require('../errors');

const authenticateUser = async (req, res, next) => {
  const { token } = req.signedCookies;
console.log(req.signedCookies);

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.payload;
      return next();
    }
      next(new CustomError.UnauthenticatedError('Authentication Invalid'));
  } catch (error) {
    next(error)
  }
};

module.exports = {authenticateUser} 