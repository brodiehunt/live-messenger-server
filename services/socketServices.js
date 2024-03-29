const socketIo = require("socket.io");
let io = null;
const userSocketMap = {};
require("dotenv").config();

exports.init = (httpServer) => {
  io = socketIo(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user is connected", socket.id);

    const userId = socket.handshake.query.userId;
    // add userid to hash socketMap
    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    socket.on("disconnect", () => {
      console.log("User disconnected");
      // remove userId from socketmap
      if (userId) {
        delete userSocketMap[userId];
      }
    });
  });
  return io;
};

exports.notifyAcceptedRequest = (friendship, recipientSocketId) => {
  io.to(recipientSocketId).emit("requestAccepted", friendship);
};

exports.notifyFriendRequest = (friendship, recipientSocketId) => {
  io.to(recipientSocketId).emit("newRequest", friendship);
};

exports.pushNewestMessage = (conversation, recipientSocketId) => {
  io.to(recipientSocketId).emit("newMessage", conversation);
};

exports.pushUpdatedReadBy = (readBy, recipientSocketId) => {
  io.to(recipientSocketId).emit("read", readBy);
};

exports.getUserSocketId = (userId) => {
  return userSocketMap[userId];
};
