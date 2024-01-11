const friendshipServices = require("../services/friendshipServices");
const {
  incrementRequests,
  resetRequests,
} = require("../services/userServices");
const socketService = require("../services/socketServices");

// Creating a new friendship (always a request: ie status pending)
exports.createFriendship = async (req, res, next) => {
  try {
    // Create new pending friendship
    const requesterId = req.user._id;
    const recieverId = req.body.id;
    const { requestFriendship, notifyUserFriendship } =
      await friendshipServices.createFriendship(requesterId, recieverId);

    // Get socket id of person recieving request
    const recipientSocketId = socketService.getUserSocketId(recieverId);

    // If online notify them of the request
    if (recipientSocketId) {
      socketService.notifyFriendRequest(
        notifyUserFriendship,
        recipientSocketId
      );
    } else {
      // If not online, update new requests object on their user obj
      await incrementRequests(recieverId);
    }

    res.status(200).json({
      message: "Success",
      data: requestFriendship,
    });
  } catch (error) {
    next(error);
  }
};

exports.acceptFriendship = async (req, res, next) => {
  try {
    // Change status of friendship from pending to active
    const friendshipId = req.params.friendshipID;
    const acceptedFriendship = await friendshipServices.acceptRequest(
      friendshipId
    );

    // If there was no returned friendship, throw error;
    // eg, user sends request, recipient recieves request but user deletes request before recipient can accept it.
    if (!acceptedFriendship) {
      const error = new Error("Friendship not found");
      error.statusCode = 404;
      throw error;
    }

    // find the recipient userId (actually the user who initially sent the friend request)
    const recipientUser = acceptedFriendship.users.find(
      (user) => user._id !== req.user._id
    );

    const recipientSocketId = socketService.getUserSocketId(recipientUser._id);

    // If that user is online, notify that their friendship request has been accepted.
    if (recipientSocketId) {
      socketService.notifyAcceptedRequest(
        acceptedFriendship,
        recipientSocketId
      );
    }

    res.status(200).json({
      message: "Success",
      data: acceptedFriendship,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFriendship = async (req, res, next) => {
  try {
    // Find and delete friendship by its id
    const friendshipId = req.params.friendshipID;
    const deletedFriendship = await friendshipServices.deleteFriendship(
      friendshipId
    );

    // If their was nothing returned - friendship wasn't found.
    // Should this really be an error? If it doesn't exist, and they wanted it deleted is that not the outcome they were after anyway?
    if (!deletedFriendship) {
      const error = new Error("Friendship not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
};

//  for the 'search friend page'
exports.getSentRequests = async (req, res, next) => {
  // Retrieve pending requests that were sent by the user
  try {
    const userId = req.user._id;
    const sentRequests = await friendshipServices.getSentRequests(userId);

    res.status(200).json({
      message: "Success",
      data: sentRequests,
    });
  } catch (error) {
    next(error);
  }
};

// for the 'search friends page'
exports.getRecievedRequests = async (req, res, next) => {
  // Retrieve requests recieved by the user
  try {
    const userId = req.user._id;
    const recievedRequests = await friendshipServices.getRecievedRequests(
      userId
    );

    // Reset their 'newRequests' field to zero (they are about to see their new requests);
    await resetRequests(userId);

    res.status(200).json({
      message: "Success",
      data: recievedRequests,
    });
  } catch (error) {
    next(error);
  }
};

// For the 'friendships page'
exports.getAllActiveFriendships = async (req, res, next) => {
  try {
    // Get all friendships the user is part of with the status 'active'
    const userId = req.user._id;
    const friendships = await friendshipServices.getFriendships(userId);

    res.status(200).json({
      message: "Success",
      data: friendships,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// 'Search friend bar' on the 'new conversation page'
exports.getFriendsByUsername = async (req, res, next) => {
  try {
    // get all the friends of the requesting user whos username matches value passed through params
    const username = req.params.username;
    const userId = req.user._id;
    const matchedFriends = await friendshipServices.getFriendsByUsername(
      userId,
      username
    );

    res.status(200).json({
      message: "Success",
      data: matchedFriends,
    });
  } catch (error) {
    next(error);
  }
};

// Returns friends of friends. Its the friends suggestion component.
exports.getPeopleYouMayKnow = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const potentialFriends = await friendshipServices.getPotentialFriends(
      userId
    );

    res.status(200).json({
      message: "Success",
      data: potentialFriends,
    });
  } catch (error) {
    next(error);
  }
};

// Shows the mutual friends between the user, and another user recommended in the people you may know section.
exports.getMutualFriends = async (req, res, next) => {
  try {
    const requestingUserId = req.user._id;
    const friendId = req.query.otherUserId;
    const mutualFriends = await friendshipServices.getMutualFriends(
      requestingUserId,
      friendId
    );

    res.status(200).json({
      message: "Success",
      data: mutualFriends,
    });
  } catch (error) {
    next(error);
  }
};

// Delete friendship from other userId - not friendship id.
// Used in the 'friendships page'
exports.deleteFriendWithId = async (req, res, next) => {
  try {
    const currentUser = req.user._id;
    const friendToDelete = req.params.friendId;
    const deleteFriend = await friendshipServices.deleteFriend(
      currentUser,
      friendToDelete
    );

    res.status(200).json({
      message: "success",
      data: deleteFriend,
    });
  } catch (error) {
    next(error);
  }
};
