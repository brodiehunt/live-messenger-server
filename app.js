
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
const accountRouter = require('./routes/accountRoutes');

app.use('/auth', authRouter);

app.use('/account', passport.authenticate('jwt', {session: false}), accountRouter);

app.get('/', (req, res) => {
  res.send('Hello world!');
})

const { errorHandler } = require('./middleware/errorHandler')
app.use(errorHandler);



module.exports = app;
