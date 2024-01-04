const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { MessageSchema } = require('./Message');

const ConversationSchema = new Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  isGroupChat: {
    type: Boolean
  },
  groupMetaData: {
    groupName: {
      type: String,
    },
    groupAdmins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }
  ],
  lastMessage: MessageSchema,
  readBy: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      username: {
        type: String,
        required: true
      },
    }
  ]
}, {timestamps: true});

const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;