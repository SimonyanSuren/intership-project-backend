require('dotenv').config();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CustomError = require('../errors');
const { sendVerEmail, sendResetPasswordEmail } = require('../helpers');

class AuthServices extends User {
  constructor() {
    super();
  }

  async register(userData) {
    let { name, email, password } = userData;

    try {
      const emailExists = await User.findOne({ where: { email } });

      if (emailExists) {
        throw new CustomError.BadRequestError('Email already exist.');
      }

      //const regExp = new RegExp(
      //  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/g
      //);

      //if (!regExp.test(password)) {
      //  throw new CustomError.BadRequestError(
      //    'Password must contains minimum 8 characters, at least one uppercase letter, one lowercase letter and one number'
      //  );
      //}

      const verificationToken = bcrypt.genSaltSync(50);
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password,
        verificationToken,
      });

      const origin = 'http://localhost:5000';

      await sendVerEmail({
        name: user.name,
        email: user.email,
        verificationToken: user.verificationToken,
        origin,
      });
    } catch (error) {
      throw error;
    }
  }

  async login(userData) {
    const { email, password } = userData;

    try {
      if (!email || !password) {
        throw new CustomError.BadRequestError(
          'Please provide email and password'
        );
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
      }

      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
      }
      if (!user.isVerified) {
        throw new CustomError.UnauthenticatedError('Please verify your email');
      }

      const token = jwt.sign({ payload: user }, process.env.JWT_SECRET);

      const oneDay = 1000 * 60; //* 60 * 24;

      return { user, token, oneDay };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyEmail(userData) {
    const { vToken, email } = userData;
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new CustomError.UnauthenticatedError('Verification Failed');
      }

      if (user.verificationToken !== vToken) {
        throw new CustomError.UnauthenticatedError('Verification Failed');
      }

      user.isVerified = true;
      user.verified = Date.now();
      user.verificationToken = '';

      await user.save();
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      if (!email) {
        throw new CustomError.BadRequestError('Please provide valid email');
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new CustomError.BadRequestError('Email does not exist');
      }

      let passwordToken = await bcrypt.genSalt(20);
      console.log(passwordToken);
      const origin = 'http://localhost:5000';
      await sendResetPasswordEmail({
        name: user.name,
        email: user.email,
        token: passwordToken,
        origin,
      });

      const tenMin = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + tenMin);

      bcrypt.hash(passwordToken, 10).then(async (res) => {
        console.log(res);
        user.passwordToken = res;
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;
        await user.save();
      });
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(userData) {
    const { token, email, password } = userData;

    try {
      if (!token || !email || !password) {
        throw new CustomError.BadRequestError('Please provide all values');
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new CustomError.BadRequestError('User does not exist');
      }
      const currentDate = new Date();

      if (
        user.passwordToken &&
        user.passwordTokenExpirationDate > currentDate &&
        bcrypt.compareSync(token, user.passwordToken)
      ) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.passwordToken = null;
        user.passwordTokenExpirationDate = null;
        await user.save();
      } else {
        throw new CustomError.BadRequestError('Invalid Credentials');
      }
    } catch (error) {
      throw error;
    }
  }

  async changePassword(userData) {
    const { email, password, newPassword, token } = userData;

    try {
      if (!token || !email || !password || !newPassword) {
        throw new CustomError.BadRequestError('Please provide all values');
      }

      const user = await User.findOne({ where: { email } });
      const checkPassword = await bcrypt.compare(password, user.password);
      const samePass = await bcrypt.compare(newPassword, user.password);

      if (!checkPassword || !user.isVerified) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
      }
      if (samePass) {
        throw new CustomError.UnauthenticatedError('Same password error');
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthServices();
