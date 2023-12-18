const User = require('../models/User');

exports.existingUsername = async (username) => {
  const user = User.findOne({username});
}

exports.existingEmail = async (email) => {
  const user = User.findOne({email})
}

exports.createUser = async ({email, name, password, username}) => {
  const newUser = await User.create({name, email, username, password});

  return newUser;
}