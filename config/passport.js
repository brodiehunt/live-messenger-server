const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

// Jwt strategy;
const cookieExtractor = (req) =>  req?.cookies ? req.cookies['jwt'] : null;

const jwtOpts = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: cookieExtractor,

}

const jwtVerifyCallback = async (jwt_payload, done) => {
  try {
    const user = await User.findOne({_id: jwt_payload.sub});

    if (user) {
      return done(null, user);
    }

    return done(null, false);

  } catch(error) {

    return done(error, false);
  }
}

passport.use(new JwtStrategy(jwtOpts, jwtVerifyCallback));

// Google strategy

const googleOpts = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}

const googleVerifyCallback = async (accessToken, refreshToken, profile, done) => {
  // create user here
  try {
    // if user exists return the user
    const user = await User.findOne({ googleId: profile.id });
    
    if (user) return done(null, user);

    // if there is no user, to make sure the email doesn't exist in another account;
    const existingEmail = await User.findOne({ email: profile._json.email });

    if (existingEmail) {
      console.log('enter existing email')
      return done(null, false, { message: 'Email already exists.' })
    }

    // If the user doesnt exist - create a user
    const userInfo = {
      googleId: profile._json.sub,
      name: profile._json.name,
      username: profile._json.email,
      email: profile._json.email,
      avatarUrl: profile._json.picture
    }
    const newUser = await User.create(userInfo);
    return done(null, newUser);
  } catch(error) {
    done(error, null);
  }
  
}

passport.use(new GoogleStrategy(googleOpts, googleVerifyCallback));