
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');

// require .dotenv file

const app = express();


app.use(express.json());

// more in this
app.use(cors({
  credentials: true,
}));

app.use(cookieParser());

// Passport config


// routes

app.get('/', (req, res) => {
  res.send('Hello world!');
})


module.exports = app;
