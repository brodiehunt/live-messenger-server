const friendshipServices = require('../services/friendshipServices');

// Pull current user id from req.user
// pull request id from req.body
// create a friendship (statuspending)
exports.createFriendship = async (req, res, next) => {
  try {
    
    const requesterId = req.user._id;
    const recieverId = req.body.id;
    const newFriendship = await friendshipServices.createFriendship(requesterId, recieverId)
    console.log('new friendship', newFriendship);
    res.status(200).json({
      message: 'Success',
      data: newFriendship
    })

  } catch(error) {
    next(error)
  }
};

// pull friendship id from req.params
// update friendship to status 'active'
exports.acceptFriendship = async (req, res, next) => {
  try {
    const friendshipId = req.params.friendshipID;
    const acceptedFriendship = await friendshipServices.acceptRequest(friendshipId)

    if (!acceptedFriendship) {
      const error = new Error('Friendship not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Success',
      data: acceptedFriendship
    })
  } catch(error) {
    next(error);
  }
};

// pull friendship id from req.params
// delete the friendship from the db
exports.deleteFriendship = async (req, res, next) => {
  try {
    const friendshipId = req.params.friendshipID;
    const deletedFriendship = await friendshipServices.deleteFriendship(friendshipId);

    if (!deletedFriendship) {
      const error = new Error('Resource not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Success'
    })

  } catch(error) {
    next(error);
  }
};

// pull user id from req.user
// query db for all friendships that contain that user and status 'pending' && requested by the current id
exports.getSentRequests = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const sentRequests = await friendshipServices.getSentRequests(userId);

    res.status(200).json({
      message: 'Success',
      data: sentRequests
    })
  } catch(error) {
    next(error);
  }
};

// pull user id from req.user
// query db for all friendships that contain that user and status 'pending' && requested by not the current id
exports.getRecievedRequests = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const recievedRequests = await friendshipServices.getRecievedRequests(userId);

    res.status(200).json({
      message: 'Success',
      data: recievedRequests
    });

  } catch(error) {
    next(error);
  }
};


// Pull user id from req.user
// query db for all friendships containing that user and status 'active';
exports.getAllActiveFriendships = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const friendships = await friendshipServices.getFriendships(userId);

    res.status(200).json({
      message: 'Success',
      data: friendships
    })
      
  } catch (error) {
    console.log(error);
    next(error);
  }
  
}

exports.getPeopleYouMayKnow = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const potentialFriends = await friendshipServices.getPotentialFriends(userId);

    res.status(200).json({
      message: 'Success',
      data: potentialFriends
    })
  } catch(error) {
    next(error);
  }
}

exports.getMutualFriends = async (req, res, next) => {
  try {
    const requestingUserId = req.user._id;
    const friendId = req.query.otherUserId;
    const mutualFriends = await friendshipServices.getMutualFriends(requestingUserId, friendId);

    res.status(200).json({
      message: 'Success',
      data: mutualFriends
    })

  } catch(error) {
    next(error);
  }
}

exports.deleteFriendWithId = async (req, res, next) => {
  console.log('enter block')
  try {
    const currentUser = req.user._id;
    const friendToDelete = req.params.friendId;
    const deleteFriend = await friendshipServices.deleteFriend(currentUser, friendToDelete);

    res.status(200).json({
      message: 'success',
      data:  deleteFriend
    })
  } catch(error) {
    next(error);
  }
}
