const express = require('express');
const router = express.Router();
const friendshipController = require('../controllers/friendshipController');

// Friendship request

// create (send) a friendship request - POST /friendships/request
router.post('/request', friendshipController.createFriendship);

// Accept Friendship request - PUT /friendships/requests/friendshipId/accept
router.put('/request/:friendshipID', friendshipController.acceptFriendship);

// Delete Friendship (same as deny request ) - DELETE /friendships/friendShipId
router.delete('/request/:friendshipID', friendshipController.deleteFriendship);

// Get requests sent by Me - GET /friendships/requests/sent
router.get('/request/sent', friendshipController.getSentRequests);

// Get requests sent TO me - get /friendships/requests/incoming
router.get('/request/recieved', friendshipController.getRecievedRequests);

// Get people you may know
router.get('/potentialFriends', friendshipController.getPeopleYouMayKnow);

// Get mutual friends
router.get('/mutualFriends', friendshipController.getMutualFriends);

// delete friendship by friend id
router.delete('/:friendId', friendshipController.deleteFriendWithId);

// Get all friends the match username
router.get('/:username', friendshipController.getFriendsByUsername);

// Get all friends - GET /friendships
router.get('/', friendshipController.getAllActiveFriendships)




module.exports = router;