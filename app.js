
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('dotenv').config();
// require .dotenv file

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}))
// more in this
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(cookieParser());

// Passport config
require('./config/passport');
app.use(passport.initialize())

// routes

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const friendshipRouter = require('./routes/friendRoutes');
const conversationRouter = require('./routes/conversationRoutes');

app.use('/auth', authRouter);
app.use('/conversation', passport.authenticate('jwt', {session: false}), conversationRouter);
app.use('/user', passport.authenticate('jwt', {session: false}), userRouter);
app.use('/friendships', passport.authenticate('jwt', {session: false}), friendshipRouter);

app.get('/', (req, res) => {
  res.send('Hello world!');
})

const { errorHandler } = require('./middleware/errorHandler')
app.use(errorHandler);

module.exports = app;

