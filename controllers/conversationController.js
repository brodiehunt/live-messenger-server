const conversationServices = require('../services/conversationServices')
const socketService = require('../services/socketServices');

exports.createConversation = async (req, res, next) => {


  
  try {
    if (!Array.isArray(req.body)) {
      const error = new Error('Invalid input: expected an array of recipient IDs');
      error.statusCode = 400;
      return next(error);
    }
  
    const recipientIds = [...req.body, req.user._id ];
    if (recipientIds.length < 2) {
      const error = new Error('Invalid recipients');
      error.statusCode = 400;
      throw error;
    }

    const existingConversation = await conversationServices.checkExistingConversation(recipientIds);

    if (existingConversation) {
      return res.status(200).json({
        message: 'Existing conversation success',
        data: existingConversation
      })
    }

    const newConversation = await conversationServices.createConversation(recipientIds, req.user._id);

    res.status(201).json({
      message: 'Conversation created. Success',
      data: newConversation
    });
  } catch(error) {
    next(error)
  }
}

exports.getConversation = async (req, res, next) => {

  try {
    const conversationId = req.params.conversationId;
    const conversation = await conversationServices.getConversation(conversationId);

    if (!conversation) {
      return res.status(404).json({message: 'Conversation not found'})
    }

    const userAlreadyRead = conversation.readBy.find((userObj) => {
      return userObj.userId.toString() === req.user._id.toString();
    })
   
    if (!userAlreadyRead) {
      const userObj = {
        userId: req.user._id,
        username: req.user.username,
      }

      const updatedConv = await conversationServices.updateReadBy (conversation, userObj);

      const updatedReadBy = updatedConv.readBy;

      const otherUsers = conversation.participants.filter((user) => {
        return user._id.toString() !== req.user._id.toString();
      });

      otherUsers.forEach((user) => {
        const userSocketId = socketService.getUserSocketId(user._id);

        if (userSocketId) {
          socketService.pushUpdatedReadBy({
            _id: updatedConv._id,
            readBy: updatedReadBy
          } , userSocketId);;
        }
      })
      // Emit event here. 

      return res.status(200).json({
        message: 'Success',
        data: updatedConv
      })
    }

    res.status(200).json({
      message: 'Success',
      data: conversation
    })

  } catch(error) {
    next(error)
  }


}

exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const conversations = await conversationServices.getConversations(userId);

    res.status(200).json({
      message: 'Success',
      data: conversations
    })
  } catch(error) {
    next(error);
  }
}

exports.addMessage = async (req, res, next) => {
  const conversationId = req.params.conversationId;
  const messageData = req.body.message;
  const userId = req.user._id;
  const username = req.user.username;

  try {
    const {newMessage, conversation} = await conversationServices.addMessage(conversationId, userId, username, messageData)

    const conversationUsers = conversation.participants.filter((participant) => {
      return participant._id !== userId;
    })

    const convUserIds = conversationUsers.map((user) => {
      return user._id;
    })

    convUserIds.forEach((userId) => {
      const socketId = socketService.getUserSocketId(userId);
      if (socketId) {
        socketService.pushNewestMessage(conversation, socketId);
      }
    })

    
    res.status(201).json({
      message: 'Success',
      data: conversation,
    })
  } catch(error) {
    next(error);
  }
}

exports.updateReadBy = async (req, res, next) => {
  const conversationId = req.params.conversationId;
  const userId = req.user._id;
  const username = req.user.username;

  try {
    const conversation = await conversationServices.getConversation(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: 'Conversation not found'
      })
    }
    const readUser = {
      userId,
      username
    }

    const userAlreadyRead = conversation.readBy.find((userObj) => {
      return userObj.userId.toString() === req.user._id.toString();
    });
    
    if (!userAlreadyRead) {

      const updatedConv = await conversationServices.updateReadBy(conversation, readUser);

      // Emit event to everyone else;
      const conversationUsers = conversation.participants.filter((participant) => {
        return participant._id !== userId;
      });

      conversationUsers.forEach((user) => {
        const userSocketId = socketService.getUserSocketId(user._id);

        if (userSocketId) {
          socketService.pushUpdatedReadBy({
            _id: updatedConv._id,
            readBy: updatedConv.readBy
          } , userSocketId);
        }
      });

      return res.status(200).json({
        message: 'Success',
        data: {
          readBy: updatedConv.readBy,
          lastMessage: updatedConv.lastMessage
        }
      });
    }

    res.status(200).json({
      message: 'Success',
      data: {
        readBy: conversation.readBy,
        lastMessage: conversation.lastMessage
      }
    })

  } catch(error) {
    next(error);
  }
}