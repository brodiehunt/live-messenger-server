const Conversation = require('../models/Conversation');
const { Message } = require('../models/Message')
const mongoose = require('mongoose');

exports.checkExistingConversation = async (userIds) => {
  const existingConversation = await Conversation.findOne({ participants: {
    $all: userIds,
    $size: userIds.length
  }});

  return existingConversation;
}

exports.createConversation = async (userIds, creatorId) => {
  const newConversation = new Conversation();
  newConversation.participants = userIds;
  newConversation.isGroupChat = userIds.length === 2 ? false : true;
  newConversation.groupMetaData = { groupAdmins: creatorId, groupName: 'Group chat'};
  newConversation.readBy = [];

  await newConversation.save();
  
  const populatedNewConversation = await Conversation.findById(newConversation._id)
    .select('participants lastMessage updatedAt')
    .populate('participants', 'username avatarUrl');
  
  return populatedNewConversation;
}

exports.getConversations = async (userId) => {
  const conversations = await Conversation.find({participants: userId}).
    select('participants lastMessage updatedAt').
    populate('participants', 'username avatarUrl')
    .sort({updatedAt: -1})

  return conversations;
}

exports.getConversation = async (conversationId) => {
  const conversation = await Conversation.findById(conversationId).
    populate('participants', 'username avatarUrl').
    populate('messages');

  return conversation;
};

exports.addMessage = async (conversationId, userId, username, message) => {
  // Create a message using the userId username,
  const newMessage = new Message();
  newMessage.conversationId = conversationId;
  newMessage.sender = userId;
  newMessage.senderName = username;
  newMessage.content = message;
  newMessage.messageType = 'text';
  await newMessage.save();

  const conversation = await Conversation.findById(conversationId);
  conversation.lastMessage = newMessage;
  conversation.readBy = [];
  conversation.messages.push(newMessage._id);
  await conversation.save();

  return newMessage;
}