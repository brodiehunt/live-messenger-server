const {
  updateUser,
  getUsersByUsernameSearch,
} = require("../services/userServices");

const {
  nameValidation,
  usernameValidation,
  emailValidation,
  handleValidation,
} = require("../utils/formValidations");

// Get user account information.
exports.getAccount = async (req, res, next) => {
  res.status(200).json({
    message: "Successful",
    data: req.user,
  });
};

// Search for all users based on a search val (matches against username field)
exports.searchUsers = async (req, res, next) => {
  try {
    const searchId = req.user._id;
    const searchVal = req.query.searchVal;
    const users = await getUsersByUsernameSearch(searchVal, searchId);

    res.status(200).json({
      message: "Success",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Update name value
exports.updateName = [
  nameValidation,
  handleValidation,
  async (req, res, next) => {
    try {
      const updatedUser = await updateUser(req, "name");

      // Could not find the user object
      if (!updatedUser) {
        const error = new Error("Resource not found");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        data: updatedUser,
        message: "successful",
      });
    } catch (error) {
      next(error);
    }
  },
];

// Update username value
exports.updateUsername = [
  usernameValidation,
  handleValidation,
  async (req, res, next) => {
    try {
      const updatedUser = await updateUser(req, "username");

      //  Could not find the user
      if (!updatedUser) {
        const error = new Error("Resource not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        data: updatedUser,
        message: "successful",
      });
    } catch (error) {
      // duplicate key error (username already exists) -thrown by mongoose
      if (error.code === 11000) {
        const error = new Error("Username already in use.");
        error.statusCode = 409;
        next(error);
      }
      next(error);
    }
  },
];

exports.updateEmail = [
  emailValidation,
  handleValidation,
  async (req, res, next) => {
    try {
      const updatedUser = await updateUser(req, "email");

      if (!updatedUser) {
        const error = new Error("Resource not found");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        data: updatedUser,
        message: "Successful",
      });
    } catch (error) {
      // duplicate key error
      if (error.code === 11000) {
        const error = new Error("Email already in use");
        error.statusCode = 409;
        next(error);
      }
      next(error);
    }
  },
];

exports.updateSettings = async (req, res, next) => {
  try {
    const updatedUser = await updateUser(req, "accountSettings");

    if (!updatedUser) {
      const error = new Error("Resource not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      data: updatedUser,
      message: "Successful",
    });
  } catch (error) {
    next(error);
  }
};
