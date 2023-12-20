const jwt = require('jsonwebtoken');

const generateJWT = (userId) => {
  const token = jwt.sign({sub: userId}, process.env.JWT_SECRET)
  return token
}


module.exports = {
  generateJWT,
}