const conversationServices = require("../services/conversationServices");
const socketService = require("../services/socketServices");

// Create a new conversation (return existing one if recipients the same)
exports.createConversation = async (req, res, next) => {
  try {
    // Make sure data from client is an array of recipient ids
    if (!Array.isArray(req.body)) {
      const error = new Error(
        "Invalid input: expected an array of recipient IDs"
      );
      error.statusCode = 400;
      return next(error);
    }

    // Add user id to array of recipient Ids
    const recipientIds = [...req.body, req.user._id];

    // Cannot create a conversation with less than two people (with yourself)
    if (recipientIds.length < 2) {
      const error = new Error("Invalid recipients");
      error.statusCode = 400;
      throw error;
    }

    // check for conversation with identical recipient ids.
    const existingConversation =
      await conversationServices.checkExistingConversation(recipientIds);

    // Return existing conversation to client in this case
    if (existingConversation) {
      return res.status(200).json({
        message: "Existing conversation success",
        data: existingConversation,
      });
    }

    // Create new conversation if one doesn't already exist between recipient users
    const newConversation = await conversationServices.createConversation(
      recipientIds,
      req.user._id
    );

    res.status(201).json({
      message: "Conversation created. Success",
      data: newConversation,
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve a single conversation
exports.getConversation = async (req, res, next) => {
  try {
    // Find conversation by id passed through parameters
    const conversationId = req.params.conversationId;
    const conversation = await conversationServices.getConversation(
      conversationId
    );

    // Throw error if conversation doesnt exist
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Find out if user has already read the most updated conversation
    const userAlreadyRead = conversation.readBy.find((userObj) => {
      return userObj.userId.toString() === req.user._id.toString();
    });

    // If users hasn't read the conversation, update readBy array (they are about to read it)
    if (!userAlreadyRead) {
      const userObj = {
        userId: req.user._id,
        username: req.user.username,
      };

      const updatedConv = await conversationServices.updateReadBy(
        conversation,
        userObj
      );

      const updatedReadBy = updatedConv.readBy;

      // Array of all other users in the conversation (not including request user)
      const otherUsers = conversation.participants.filter((user) => {
        return user._id.toString() !== req.user._id.toString();
      });

      // Emit event to all users currently online and in the conversation.
      // Send them the updated readByArray. (only consumed if user is viewing conversation)
      otherUsers.forEach((user) => {
        const userSocketId = socketService.getUserSocketId(user._id);

        if (userSocketId) {
          socketService.pushUpdatedReadBy(
            {
              _id: updatedConv._id,
              readBy: updatedReadBy,
            },
            userSocketId
          );
        }
      });

      // Return updated conversation the the user
      return res.status(200).json({
        message: "Success",
        data: updatedConv,
      });
    }

    // Return conversation to the user
    res.status(200).json({
      message: "Success",
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

// Get all conversations a user is part of (for conversation list);
exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const conversations = await conversationServices.getConversations(userId);

    res.status(200).json({
      message: "Success",
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

// Add message to conversation
exports.addMessage = async (req, res, next) => {
  const conversationId = req.params.conversationId;
  const messageData = req.body.message;
  const userId = req.user._id;
  const username = req.user.username;

  try {
    // Add message to conversation - return conversation
    const { newMessage, conversation } = await conversationServices.addMessage(
      conversationId,
      userId,
      username,
      messageData
    );

    // Get all other participants to the conversation
    const conversationUsers = conversation.participants.filter(
      (participant) => {
        return participant._id !== userId;
      }
    );

    // THIS STEP IS REDUNDANT. RUN FOR EACH ON CONVERSATION USERS INSTEAD
    const convUserIds = conversationUsers.map((user) => {
      return user._id;
    });

    // send updated conversation to the participants who are online.
    convUserIds.forEach((userId) => {
      const socketId = socketService.getUserSocketId(userId);
      if (socketId) {
        socketService.pushNewestMessage(conversation, socketId);
      }
    });

    // Return the updated conversation to the requesting user.
    res.status(201).json({
      message: "Success",
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

// Update readBy array (happens whilst in a conversation, ie they didnt need to open it when the most recent message was sent)
exports.updateReadBy = async (req, res, next) => {
  const conversationId = req.params.conversationId;
  const userId = req.user._id;
  const username = req.user.username;

  try {
    // Find the conversation
    const conversation = await conversationServices.getConversation(
      conversationId
    );

    // Return error if conversation doesn't exist
    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const readUser = {
      userId,
      username,
    };

    // Has the user already been registered as having read the conversation
    const userAlreadyRead = conversation.readBy.find((userObj) => {
      return userObj.userId.toString() === req.user._id.toString();
    });

    // If the user hasn't read the conversation
    if (!userAlreadyRead) {
      // Add user to the readBy array
      const updatedConv = await conversationServices.updateReadBy(
        conversation,
        readUser
      );

      // array of every other user
      const conversationUsers = conversation.participants.filter(
        (participant) => {
          return participant._id !== userId;
        }
      );

      // Emit event to each user who is online
      conversationUsers.forEach((user) => {
        const userSocketId = socketService.getUserSocketId(user._id);

        if (userSocketId) {
          socketService.pushUpdatedReadBy(
            {
              _id: updatedConv._id,
              readBy: updatedConv.readBy,
            },
            userSocketId
          );
        }
      });

      // return updated readBy array.
      return res.status(200).json({
        message: "Success",
        data: {
          readBy: updatedConv.readBy,
          lastMessage: updatedConv.lastMessage,
        },
      });
    }

    // Return conversation without updating readBy array
    res.status(200).json({
      message: "Success",
      data: {
        readBy: conversation.readBy,
        lastMessage: conversation.lastMessage,
      },
    });
  } catch (error) {
    next(error);
  }
};
