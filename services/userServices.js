const User = require("../models/User");
const Friendship = require("../models/Friendship");

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

exports.getUsersByUsernameSearch = async (searchVal, searchId) => {
  const users = await User.find({
    username: { $regex: "^" + searchVal, $options: "i" },
    "accountSettings.isPrivate": false,
  }).limit(10);

  const userIds = users.map((user) => user._id);

  const friendships = await Friendship.find({
    $and: [{ users: searchId }, { users: { $in: userIds } }],
  });

  const friendUserIds = new Set();
  // Set of friends ids in the user search result
  friendships.forEach((friendship) => {
    friendship.users.forEach((userId) => {
      if (userId.toString() !== searchId.toString()) {
        friendUserIds.add(userId.toString());
      }
    });
  });

  const includeFriendStatusUsers = users.map((user) => {
    const isFriend = friendUserIds.has(user._id.toString());
    return { ...user.toObject(), friend: isFriend };
  });

  return includeFriendStatusUsers;
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
