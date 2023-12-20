const User = require('../models/User');

exports.existingUsername = async (username) => {
  const user = User.findOne({username});
  return user;
}

exports.existingEmail = async (email) => {
  const user = User.findOne({email})
  return user
}

exports.createUser = async ({email, name, password, username}) => {
  const newUser = await User.create({name, email, username, password});

  return newUser;
}

exports.findUserFromToken = async (token) => {
  const user = await User.findOne({'passwordResetToken.token': token});
  return user;
}