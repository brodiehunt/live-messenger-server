const User = require("../models/User");

exports.updateUser = async (req, fieldName) => {
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    return null;
  }

  if (fieldName === "accountSettings") {
    user[fieldName] = req.body;
  } else {
    user[fieldName] = req.body[fieldName];
  }

  await user.save();
  return user;
};

exports.getUsersByUsernameSearch = async (searchVal) => {
  const users = await User.find({
    username: { $regex: "^" + searchVal, $options: "i" },
    "accountSettings.isPrivate": false,
  }).limit(10);
  return users;
};

exports.resetRequests = async (userId) => {
  const user = await User.findById(userId);
  user.newRequests = 0;
  await user.save();
  return user;
};

exports.incrementRequests = async (userId) => {
  const user = await User.findById(userId);
  user.newRequests = user.newRequests + 1;
  await user.save();
  return user;
};
