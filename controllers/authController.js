const {signinValidation, handleValidation } = require('../utils/formValidations');
const { generateToken } = require('../utils/generateJwt');

exports.signin = [
  signinValidation,
  handleValidation,
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

  }
];

