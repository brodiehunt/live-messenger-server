const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      required: true,
      default: "text",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = { Message, MessageSchema };
