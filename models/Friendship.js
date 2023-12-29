const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendshipSchema = new Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  requestUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  accepted: {
    type: Boolean,
    required: true,
    default: false,
  }
}, {timestamps: true});

FriendshipSchema.index({ users: 1 });
const Friendship = mongoose.model('Friendship', FriendshipSchema);
module.exports = Friendship;