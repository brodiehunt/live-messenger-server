const passport = require('passport');
const authServices = require('../services/authServices');
const {signinValidation, registerValidation, handleValidation } = require('../utils/formValidations');
const { generateToken } = require('../utils/generateJwt');

exports.signin = [
  signinValidation,
  handleValidation,
  passport.authenticate('local', {session: false}),
  async (req, res, next) => {

    const jwt = generateToken(req.user._id);

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
    
      const jwt = generateToken(newUser._id);

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
  const jwt = generateToken(req.user._id)
  const clientRedirectUrl = `http://localhost:5173/auth-callback?user=${encodeURIComponent(JSON.stringify(req.user))}`;
  res.cookie('jwt', jwt, {
    httpOnly: true
  })
  res.redirect(clientRedirectUrl);
}

exports.googleFailure = (req, res) => {
  res.redirect('http://localhost:5173/register?failure=true')
};

