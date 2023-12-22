const User = require('../models/User');

exports.updateUser = async (req, fieldName) => {
  const {id} = req.user;

  const user = await User.findById(id);

  if (!user) {
   return null;
  }
  
  if (fieldName === 'accountSettings') {
    user[fieldName] = req.body;
  } else {
    user[fieldName] = req.body[fieldName];
  }

  await user.save()
  return user;
}

