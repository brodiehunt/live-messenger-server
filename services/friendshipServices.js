const Friendship = require('../models/Friendship');
const User = require('../models/User');

exports.createFriendship = async (requesterId, recieverId) => {
  const newFriendship = new Friendship();
  newFriendship.users = [requesterId, recieverId];
  newFriendship.requestUser = requesterId;
  await newFriendship.save();
  return newFriendship;
}

exports.acceptRequest = async (friendshipId) => {
  const friendship = await Friendship.findById(friendshipId);
  friendship.accepted = true;
  await friendship.save();
  return friendship;
}

exports.deletedFriendship = async (friendshipId) => {
  const friendship = await Friendship.findByIdAndDelete(friendshipId);
  return friendship;
}

exports.getSentRequests = async (userId) => {
  const sentRequests = await Friendship.find({ users: userId, requestUser: userId, accepted: false});

  return sentRequests;

}

exports.getRecievedRequests = async (userId) => {
  const recievedRequests = await Friendship.find({ users: userId, requestUser: { $ne: userId }, accepted: false});

  return recievedRequests;
}

exports.getFriendships = async (userId) => {
  const activeFriendships = await Friendship.find( {users: userId, accepted: true});

  return activeFriendships;
}