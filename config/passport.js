const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// Local Strategy

const localOptions = {
  usernameField: 'email',
  session: false,
}

const localVerifyCallback = async (email, password, done) => {

  try {
    // override {select: false} at the schema level
    const user = await User.findOne({email}).select('email +password');

    // Wrong email
    if (!user) return done(null, false, {message: 'Incorrect email or password'})

    // correct email but registered through google
    if (user && !user.password) return done(null, false, {message: 'Please sign in using Google'})
    
    const passwordCorrect = await user.verifyPassword(password);

    // incorrect password, correct email
    if (!passwordCorrect) return done(null, false, { message: 'Incorrect email or password' } )

    // return full user object (not incl password)
    const fullUser = await User.findOne({email});

    return done(null, fullUser);

  } catch (error) {
    return done(error)
  }
}

passport.use(new LocalStrategy(localOptions, localVerifyCallback));