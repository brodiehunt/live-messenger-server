const conversationServices = require('../services/conversationServices')

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
    const newMessage = await conversationServices.addMessage(conversationId, userId, username, messageData)

    res.status(201).json({
      message: 'Success',
      data: newMessage
    })
  } catch(error) {
    next(error);
  }
}