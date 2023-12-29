const Friendship = require('../models/Friendship');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.createFriendship = async (requesterId, recieverId) => {
  const newFriendship = new Friendship();
  newFriendship.users = [requesterId, recieverId];
  newFriendship.requestUser = requesterId;
  await newFriendship.save();
  
  const refetchedFriendship = await Friendship.findById(newFriendship._id).populate('users');

  const transformedFriendship = {
    _id: refetchedFriendship._id,
    accepted: refetchedFriendship.accepted,
    userDetails: refetchedFriendship.users.find((user) => user._id.toString() !== requesterId.toString())
  }

  return transformedFriendship;
}

exports.acceptRequest = async (friendshipId) => {
  const friendship = await Friendship.findById(friendshipId);
  friendship.accepted = true;
  await friendship.save();
  return friendship;
}

exports.deleteFriendship = async (friendshipId) => {
  const friendship = await Friendship.findByIdAndDelete(friendshipId);
  return friendship;
}

exports.getSentRequests = async (userId) => {
  const sentRequests = await Friendship.find({ users: userId, requestUser: userId, accepted: false})
  .sort({createdAt: -1})
  .populate('users');

  const transformedRequests = sentRequests.map((request) => {
    return {
      _id: request._id,
      status: request.status,
      userDetails: request.users.find((user) => user._id.toString() !== userId.toString())
    }
  })

  return transformedRequests;

}

exports.getRecievedRequests = async (userId) => {
  const recievedRequests = await Friendship.find({ users: userId, requestUser: { $ne: userId }, accepted: false})
  .sort({createdAt: -1})
  .populate('users');

  // Build return arr of objs;

  const transformedRequests = recievedRequests.map((request) => {
    return {
      _id: request._id,
      status: request.status,
      userDetails: request.users.find((user) => user._id.toString() !== userId.toString())
    }
  })

  return transformedRequests;
}

exports.getFriendships = async (userId) => {
  const activeFriendships = await Friendship.find( {users: userId, accepted: true});

  return activeFriendships;
}

exports.getPotentialFriends = async (userId) => {
  // Get a unique list of friend ids (user included)
  const userFriends = await Friendship.find({ users: userId })
    .distinct('users');
  
  // Filter request user from list
  const friendIds = userFriends.filter((id) => {
    return id !== userId;
  })

  // From this list of ids. find all friendships stemming from the list.
  // remove documents containing direct friends and requesting user
  // group based on user id, create mutual field as the sum,
  // sort in ascending order (highest mutual friends first)
  const potentialFriends = await Friendship.aggregate([
    { $match: { users: { $in: friendIds }}},
    { $unwind: '$users' },
    { $match: { users: { $ne: userId , $nin: friendIds}}},
    { $group: { _id: '$users', mutualFriendsCount: { $sum: 1 }}},
    { $sort: { mutualFriendsCount: -1 }},
    { $limit: 20},
    { $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'userInfo',
    }},
    { $unwind: '$userInfo' }
  ]);

  console.log('potentialFriends', potentialFriends);

  // array of objects looking like:
  // {
  //   _id: 'ffjf',
  //   mutualFriendsCount: 6,
  //   userInfo: {user subdoc}

  // }

  // Filter objects the dont contain isPrivate: false
  const nonPrivateUsers = potentialFriends.filter((friend) => {
    return !friend.userInfo.accountSettings.isPrivate
  })

  return nonPrivateUsers;

}

exports.getMutualFriends = async (userId, friendId) => {
  // Fetch all common users between friendships
  // unwind the users property
  // strip all objects that contain either of these two ids
  // group by id and count
  // strip all with a count of 1
  // return objects
  const friendIdObj = new mongoose.Types.ObjectId(friendId)

  const mutualFriends = await Friendship.aggregate([
    { $match: { users: { $in: [ userId, friendIdObj ]}}},
    { $unwind: '$users' },
    { $match: { users: { $nin: [ userId, friendIdObj ]}}},
    { $group: { _id: '$users', mutualFriendCount: { $sum: 1 }}},
    { $match: { mutualFriendCount: { $gte: 2 }}},
    { $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'userInfo'
    }},
    { $unwind: '$userInfo'},
    { $project: {
      _id: 1,
      'username': '$userInfo.username',
      'avatarUrl': '$userInfo.avatarUrl'
    }}
  ]);

  console.log('mutual friends', mutualFriends)
  return mutualFriends;

}