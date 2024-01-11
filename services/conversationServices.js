const Conversation = require("../models/Conversation");
const { Message } = require("../models/Message");

exports.checkExistingConversation = async (userIds) => {
  // find a conversation that has identical participant ids
  const existingConversation = await Conversation.findOne({
    participants: {
      $all: userIds,
      $size: userIds.length,
    },
  });

  return existingConversation;
};

exports.createConversation = async (userIds, creatorId) => {
  // Create new conversation
  const newConversation = new Conversation();
  newConversation.participants = userIds;
  newConversation.isGroupChat = userIds.length === 2 ? false : true;
  newConversation.groupMetaData = {
    groupAdmins: creatorId,
    groupName: "Group chat",
  };
  newConversation.readBy = [];

  await newConversation.save();

  // Fetch the same conversation and populate certain fields
  const populatedNewConversation = await Conversation.findById(
    newConversation._id
  )
    .select("participants lastMessage updatedAt readBy")
    .populate("participants", "username avatarUrl");

  return populatedNewConversation;
};

// Get list of all user conversations
exports.getConversations = async (userId) => {
  const conversations = await Conversation.find({ participants: userId })
    .select("participants lastMessage updatedAt readBy")
    .populate("participants", "username avatarUrl")
    .sort({ updatedAt: -1 });

  return conversations;
};

// Get a single conversation
exports.getConversation = async (conversationId) => {
  const conversation = await Conversation.findById(conversationId)
    .populate("participants", "username avatarUrl")
    .populate("messages");

  return conversation;
};

exports.updateReadBy = async (conversationDoc, userObj) => {
  conversationDoc.readBy.push(userObj);
  await conversationDoc.save();
  return conversationDoc;
};

// Add a message to an existing conversation
exports.addMessage = async (conversationId, userId, username, message) => {
  // Create a message using the userId username,
  const newMessage = new Message();
  newMessage.conversationId = conversationId;
  newMessage.sender = userId;
  newMessage.senderName = username;
  newMessage.content = message;
  newMessage.messageType = "text";
  await newMessage.save();

  const conversation = await Conversation.findById(conversationId)
    .select("participants messages lastMessage updatedAt readBy")
    .populate("participants", "username avatarUrl");
  conversation.lastMessage = newMessage;
  conversation.readBy = [{ userId, username }];
  conversation.messages.push(newMessage._id);
  await conversation.save();

  return { newMessage, conversation };
};
