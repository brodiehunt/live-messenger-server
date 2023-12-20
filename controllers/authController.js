const passport = require('passport');
const authServices = require('../services/authServices');
const { 
  signinValidation, 
  registerValidation,
  emailValidation,
  passwordValidation, 
  handleValidation } = require('../utils/formValidations');
const { generateJWT } = require('../utils/generateJwt');
const { generateResetToken } = require('../utils/generateToken');
const { sendPasswordResetEmail } = require('../utils/mail');

require('dotenv').config();

exports.signin = [
  signinValidation,
  handleValidation,
  passport.authenticate('local', {session: false}),
  async (req, res, next) => {

    const jwt = generateJWT(req.user._id);

    res.cookie('jwt', jwt, {
      httpOnly: true, 
    });

    res.status(200).json({
      message: 'Successful login',
      data: req.user
    });
  }
];

exports.register = [
  registerValidation,
  handleValidation,
  async (req, res, next) => {
    const {username, email} = req.body;
    try {
    
      // Check username is not in use
      const existingUsername = await authServices.existingUsername(username);
      // Throw if it is
      if (existingUsername) {
        const error = new Error('Username is already in use')
        error.statusCode = 401;
        throw error;
      }

      // Check email is not in use
      const existingEmail = await authServices.existingEmail(email);
      console.log(existingEmail);
      // Throw if it is
      if (existingEmail) {
        const error = new Error('Email is already in use')
        error.statusCode = 401;
        throw error;
      }

      const newUser = await authServices.createUser(req.body);
    
      const jwt = generateJWT(newUser._id);

      res.cookie('jwt', jwt, {
        httpOnly: true
      })

      res.status(201).json({
        message: 'Registration successful',
        data: newUser,
      })

    } catch (error) {
      next(error);
    }
  }
];

exports.googleSuccess = (req, res) => {
  const jwt = generateJWT(req.user._id)
  const baseUrl = process.env.CLIENT_URL;
  const clientRedirectUrl = `${baseUrl}/auth-callback?user=${encodeURIComponent(JSON.stringify(req.user))}`;
  res.cookie('jwt', jwt, {
    httpOnly: true
  })
  res.redirect(clientRedirectUrl);
}

exports.googleFailure = (req, res) => {
  const baseUrl = process.env.CLIENT_URL;
  res.redirect(`${baseUrl}/register?failure=true`)
};

exports.passwordRequest = [
  emailValidation,
  handleValidation,
  async (req, res, next) => {

    try {
      const user = await authServices.existingEmail(req.body.email);

      // No account using this email
      if (!user) {
        const error = new Error('No account registered with this email.');
        error.statusCode = 404;
        throw error;
      }

      // Account using this email is registered with google - cannot change password
      if (user.googleId) {
        const error = new Error('Account registered with google. Cannot change password');
        error.statusCode = 409;
        throw error;
      }

      // user does exist and is able to change pw. 
      const token = generateResetToken();
      const now = new Date();
      const expires = new Date(now.getTime() + 10 * 60000); // 10 min from now
      user.passwordResetToken = {
        expires,
        token
      }
      await user.save()
      await sendPasswordResetEmail(token, user.email)
      res.status(200).json({
        message: 'success'
      })

    } catch(error) {
      next(error)
    }
  }
];

exports.passwordReset = [
  passwordValidation,
  handleValidation,
  async (req, res, next) => {
  
    try {
      const userFromToken = req.body.token ? await authServices.findUserFromToken(req.body.token): null;
      console.log(req.body.token);
      // token provided is asscoiated with any user
      if (!userFromToken) {
        const error = new Error('Invalid token');
        error.statusCode = 404;
        throw error;
      }

      // token provided is associated with user but has expired
      const now = new Date();
      if (userFromToken && (now > userFromToken.passwordResetToken.expires)) {
        const error = new Error('Token has expired');
        error.statusCode = 401;
        throw error;
      }

      userFromToken.password = req.body.password;
      await userFromToken.save();

      return res.status(201).json({
        message: 'Password successfully reset.'
      })
    } catch(error) {
      next(error)
    }
  

  // validate the token and expiry
  // update the user password
  // send response to the client.
  }
] 
