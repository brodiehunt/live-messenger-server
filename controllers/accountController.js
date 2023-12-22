const {updateUser} = require('../services/accountServices');

const {
  nameValidation,
  usernameValidation,
  emailValidation,
  handleValidation
} = require('../utils/formValidations');

exports.updateName = [
  nameValidation,
  handleValidation,
  async (req, res, next) => {
   
    try {
      const updatedUser = await updateUser(req, 'name');
      
      if (!updatedUser) {
        const error = new Error('Resource not found');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        data: updatedUser,
        message: 'successful'
      })

    } catch(error) {
      next(error);
    }
  }
];

exports.updateUsername = [
  usernameValidation,
  handleValidation,
  async (req, res, next) => {

    try {
      const updatedUser = await updateUser(req, 'username');

      if (!updatedUser) {
        const error = new Error('Resource not found');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        data: updatedUser,
        message: 'successful'
      })

    } catch(error) {
      // duplicate key error (username already exists)
      if (error.code === 11000) {
        const error = new Error('Username already in use.');
        error.statusCode = 409;
        next(error)
      }
      next(error);
    }
    
  }
]

exports.updateEmail = [
  emailValidation,
  handleValidation,
  async (req, res, next) => {
    try {
      const updatedUser = await updateUser(req, 'email');

      if (!updatedUser) {
        const error = new Error('Resource not found');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        data: updatedUser,
        message: 'Successful'
      })
    } catch(error) {
      if (error.code === 11000) {
        const error = new Error('Email already in use');
        error.statusCode = 409;
        next(error);
      }
      next(error);
    }
  }
];

exports.updateSettings = async (req, res, next) => {

  try {
    const updatedUser = await updateUser(req, 'accountSettings');

    if (!updatedUser) {
      const error = new Error('Resource not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      data: updatedUser,
      message: 'Successful'
    })
  } catch(error) {
    next(error);
  }
}

