const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');


// Get conversations 
router.get('/', conversationController.getConversations)

// Create conversation
router.post('/', conversationController.createConversation);

// Get single conversation
router.get('/:conversationId', conversationController.getConversation)

// Add message to conversation
router.post('/:conversationId/message', conversationController.addMessage)



module.exports = router;