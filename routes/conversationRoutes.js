const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");

// Get conversations
router.get("/", conversationController.getConversations);

// Create conversation
router.post("/", conversationController.createConversation);

// Get single conversation
router.get("/:conversationId", conversationController.getConversation);

// Add message to conversation
router.post("/:conversationId/message", conversationController.addMessage);

// Update readBy array on a conversation
router.put("/:conversationId/read", conversationController.updateReadBy);

module.exports = router;
