const friendshipServices = require('../services/friendshipServices');

// Pull current user id from req.user
// pull request id from req.query
// create a friendship (statuspending)
exports.createFriendship = async (req, res, next) => {
  try {
    const requesterId = req.user._id;
    const recieverId = req.query.id;
    const newFriendship = await friendshipServices.createFriendship(requesterId, recieverId)

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
    next(error);
  }
  
}
