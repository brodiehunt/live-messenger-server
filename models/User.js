const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Mongodb will only index docs where googleId exists
  },
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
  },
  avatarUrl: {
    type: String,
  },
  password: {
    type: String,
    select: false,  // by default will not be returned from queries.
  },
  passwordResetToken: {
    expires: {
      type: Date,
    },
    token: {
      type: String,
    }
  },
  accountSettings: {
    isPrivate: {
      type: Boolean,
      default: false
    },
    allowNonFriendMessages: {
      type: Boolean,
      default: true,
    }
  },
}, {timestamps: true});

UserSchema.plugin(require('mongoose-bcrypt'));
const User = mongoose.model('User', UserSchema);
module.exports = User;